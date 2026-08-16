# Clinic Karma Architecture

## Purpose

Clinic Karma is a role-based clinic management system with a React frontend, an
Express API, and PostgreSQL hosted on Neon. This document is the architecture
contract for ongoing repairs: new code should follow these boundaries, while
legacy code is migrated incrementally without breaking the UI.

## Runtime flow

```text
React page/component
    -> frontend API client
    -> Express router
    -> authentication and role middleware
    -> controller
    -> service (for multi-step business workflows)
    -> db_utils repository
    -> PostgreSQL/Neon
```

Responsibilities are deliberately separated:

- **Frontend components** render state and submit typed API requests. They must
  not be trusted to enforce authorization.
- **Routers** define URLs, validation middleware, authentication, and allowed
  roles. They contain no SQL or business rules.
- **Controllers** translate HTTP input to application calls and map results or
  known errors to HTTP responses.
- **Services** coordinate multi-table workflows such as booking an appointment,
  recording a payment, or registering a staff member. These workflows must be
  transactional.
- **`db_utils` modules** are the repository/data-access layer. They own SQL and
  return database records; they do not send HTTP responses.
- **PostgreSQL** enforces keys, referential integrity, uniqueness, valid status
  values, and non-negative monetary values.

Simple reads may call a repository directly from a controller. Any operation
that writes multiple tables must use a service and a database transaction.

During the current migration stage, consultation booking calls the PostgreSQL
`book_consultation` function. It atomically validates the patient, doctor,
branch, specialization, patient-per-day rule, and slot capacity before creating
the appointment, doctor assignment, and initial bill. A later service-layer
refactor may own the orchestration, but it must retain this transaction boundary.

## Backend modules

Each API area has one canonical controller and repository module. Suffixed
copies such as `_y.js` are prohibited.

| API area | Router | Controller | Primary repository |
| --- | --- | --- | --- |
| Authentication | `authRouter.js` | `authController.js` | `user.js`, `patient.js` |
| Patient | `patientRouter.js` | `patientController.js` | `patient.js`, `doctor.js` |
| Doctor | `doctorRouter.js` | `doctorController.js` | `doctor.js` |
| Appointments/billing | `appointmentRouter.js` | `appointmentController.js` | `appointment.js` |
| Branch management | `branchmanagerRouter.js` | `branchmanagerController.js` | `branchmanager.js` |
| Top management | `topmanagerRouter.js` | `topmanagerController.js` | `topmanager.js` |

`appointmentController.js` still contains legacy direct SQL and several debug
handlers. Those are known migration items, not examples to copy. Runtime schema
mutation is no longer required because changes are owned by the migration
runner under `backend/database/`.

## Identity and roles

`User` is the only login identity. A user has exactly one canonical role:

- `patient`
- `doctor`
- `receptionist`
- `lab-coordinator`
- `branch-manager`
- `top-manager`

Patients have a `Patient` profile. Every non-patient role has a `Staff` profile;
doctors additionally have a `Doctor` profile. Manager-specific login tables are
not part of the target model.

The JWT `sub` claim contains `User.user_id`. Controllers must resolve profiles
from `sub`; URL parameters such as `patientId` and `doctorId` are resource
identifiers, never proof of ownership.

## Authentication request lifecycle

```text
Login credentials
    -> User lookup
    -> bcrypt password comparison
    -> short-lived access token + rotating refresh token
    -> hashed refresh token stored in RefreshToken
    -> role middleware validates access token for later requests
```

The frontend may use role information for navigation, but backend middleware is
the security boundary.

## Core workflow

The interview/demo workflow is:

```text
Patient registers and logs in
    -> patient or receptionist books a doctor slot
    -> doctor sees the assigned appointment
    -> doctor records diagnosis/prescription and completes it
    -> billing applies approved insurance
    -> receptionist records one or more payments
    -> patient sees appointment, bill, payments, history, and reports
```

Every stage should be traceable through foreign keys beginning with the same
appointment record.

## Configuration

Runtime configuration is loaded and validated by `src/config/env.js`. Secrets
belong only in ignored `.env` files or deployment secret stores. `.env.example`
documents required names without containing credentials.

## Current migration boundaries

The database schema, constraints, migration ledger, reference seed, and
verification commands are implemented. The following are intentionally
deferred to subsequent phases:

1. Enforcing ownership and role authorization on all routes.
2. Moving remaining multi-table workflows into transactional services while
   retaining the atomic booking boundary.
3. Removing debug/schema mutation endpoints.
4. Securing lab-report storage and downloads.
