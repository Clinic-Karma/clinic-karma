# Clinic Karma Definitive Database Model

This model is implemented by `backend/database/schema.sql` and the ordered SQL
files under `backend/database/migrations/`.

The repaired database retains the original quoted PostgreSQL identifiers, such
as `"Appointment_ID"`, so existing API queries remain compatible. Those
physical names do not change the logical model described below.

## Identity and organization

### User

- `user_id` primary key
- `name`, `nic`, `email`, `contact_number`, `address`
- `username` unique and required
- `password_hash` required
- `user_type` required and restricted to the canonical roles
- timestamps and `is_active`

NIC and email are unique when present. Passwords are stored only as bcrypt
hashes.

### Branch

- `branch_name` primary key
- contact number and address

### Staff

- `staff_id` primary key
- `user_id` unique foreign key to `User`
- `branch_name` foreign key to `Branch`
- salary and `is_active`

The role comes from `User.user_type`; a second conflicting role column is not
required.

### Patient

- `patient_id` primary key
- `user_id` unique foreign key to `User`
- date of birth, gender, and emergency contact

### Doctor

- `doctor_id` primary key
- `staff_id` unique foreign key to `Staff`

### Specialization and DoctorSpecialization

- `Specialization`: identifier, unique name, and non-negative consultation fee
- `DoctorSpecialization`: composite primary key of doctor and specialization

## Clinical workflow

### Appointment

- `appointment_id` primary key
- `patient_id` foreign key to `Patient`
- `branch_name` foreign key to `Branch`
- appointment date
- type
- status
- creation/update timestamps

Canonical appointment statuses are `Scheduled`, `Confirmed`, `Completed`, and
`Cancelled`. Canonical types are `Consultation` and `Laboratory`.

### DoctorAppointment

- `appointment_id` primary/foreign key to `Appointment`
- `doctor_id` foreign key to `Doctor`
- `specialization_id` foreign key to `Specialization`
- start time and emergency flag
- diagnosis, prescription, and additional notes

A doctor assignment is mandatory for a consultation appointment. Booking must
create `Appointment`, `DoctorAppointment`, and the initial `Billing` row in one
transaction. Slot-capacity checks must occur in that transaction.

### Catalogue and TreatmentAppointment

- `Catalogue`: treatment/test identifier, unique name, and non-negative price
- `TreatmentAppointment`: appointment key, catalogue key, and private report
  object reference

The report reference is storage metadata, not a public URL.

## Billing and insurance

### Billing

- `bill_id` primary key
- `appointment_id` unique foreign key to `Appointment`
- total, insured, and patient amounts
- due date and status

Canonical statuses are `Pending`, `Partial`, and `Paid`. All amounts are
non-negative, and insured plus patient responsibility must equal the total.
`patient_amount` is the original patient responsibility; it is never reduced
when payments are inserted.

### Payment

- `payment_id` generated primary key
- `bill_id` foreign key to `Billing`
- positive amount, timestamp, method, and optional reference

Remaining balance is always calculated as:

```text
Billing.patient_amount - SUM(Payment.amount)
```

### Insurance

- `insurance_id` primary key
- unique provider name
- coverage percentage constrained from 0 through 100
- type and active state

### PatientInsurance

- `patient_insurance_id` primary key
- patient and insurance foreign keys
- policy number
- status restricted to `Pending`, `Approved`, or `Rejected`
- uniqueness across patient, provider, and policy number

Only approved coverage can affect a bill.

### InsuranceClaim

- claim identifier
- bill and patient-insurance foreign keys
- positive claim amount
- status, submission date, and decision date

## Sessions and auditing

### RefreshToken

- token identifier
- `user_id` foreign key to `User`
- unique JWT ID (`jti`)
- SHA-256 token hash
- expiry, revocation, and creation timestamps

The table name is `refresh_tokens`, and the expiry column is `expires_at`.

### AuditLog

- audit identifier
- optional acting user
- table/entity, record identifier, operation, timestamp
- old and new JSON values

Audit triggers and application logging must target these exact column names.

## Deletion policy

- Users and clinical/financial records are normally deactivated, not physically
  deleted.
- Hard deletion is limited to test data or explicit administrative maintenance.
- Appointments, bills, payments, diagnoses, claims, and audit records must be
  retained according to the clinic's legal retention requirements.
