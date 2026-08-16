import { sql } from '../src/db_utils/db.js';

const expectedColumns = {
  User: ['user_id', 'username', 'password_hash', 'user_type', 'is_active'],
  Patient: ['patient_id', 'user_id'],
  Staff: ['Staff_ID', 'User_ID', 'Branch_Name'],
  Doctor: ['Doctor_ID', 'Staff_ID'],
  Appointment: ['Appointment_ID', 'Patient_ID', 'Appointment_Date', 'Status', 'Type', 'Branch_Name'],
  Doctor_Appointment: ['Appointment_ID', 'Doctor_ID', 'Start_Time', 'Specialization_ID'],
  Billing: ['Bill_ID', 'Appointment_ID', 'Total_Amount', 'Insured_Amount', 'Patient_Amount', 'Status'],
  Payment: ['Payment_ID', 'Bill_ID', 'Amount', 'Date_Time'],
  Patient_Insurance: ['Patient_Insurance_ID', 'Patient_ID', 'Insurance_ID', 'Status'],
  Insurance_Claim: ['Insurance_Claim_ID', 'Bill_ID', 'Patient_Insurance_ID', 'Claim_Status'],
  refresh_tokens: ['id', 'user_id', 'jti', 'token_hash', 'expires_at', 'revoked'],
  audit_log: ['id', 'table_name', 'record_id', 'operation_type', 'changed_by_user_id'],
};

const columns = await sql.query(`
  SELECT table_name, column_name
  FROM information_schema.columns
  WHERE table_schema = 'public'
`);
const available = new Map();
for (const { table_name: tableName, column_name: columnName } of columns) {
  if (!available.has(tableName)) available.set(tableName, new Set());
  available.get(tableName).add(columnName);
}

const problems = [];
for (const [tableName, requiredColumns] of Object.entries(expectedColumns)) {
  if (!available.has(tableName)) {
    problems.push(`Missing table: ${tableName}`);
    continue;
  }
  for (const columnName of requiredColumns) {
    if (!available.get(tableName).has(columnName)) {
      problems.push(`Missing column: ${tableName}.${columnName}`);
    }
  }
}

const requiredFunctions = [
  'book_consultation',
  'enforce_doctor_slot_capacity',
  'validate_billing_insurance',
  'validate_insurance_claim_relationship',
  'validate_payment_amount',
];
const functions = await sql.query(`
  SELECT routine_name
  FROM information_schema.routines
  WHERE routine_schema = 'public'
`);
const availableFunctions = new Set(functions.map(({ routine_name: routineName }) => routineName));
for (const functionName of requiredFunctions) {
  if (!availableFunctions.has(functionName)) problems.push(`Missing function: ${functionName}`);
}

const invalidValues = await sql.query(`
  SELECT
    (SELECT COUNT(*) FROM "User" WHERE user_type NOT IN (
      'patient', 'doctor', 'receptionist', 'lab-coordinator', 'branch-manager', 'top-manager'
    ))::int AS invalid_roles,
    (SELECT COUNT(*) FROM "Appointment" WHERE "Status" NOT IN (
      'Scheduled', 'Confirmed', 'Completed', 'Cancelled'
    ))::int AS invalid_appointment_statuses,
    (SELECT COUNT(*) FROM "Appointment" WHERE "Type" NOT IN (
      'Consultation', 'Laboratory'
    ))::int AS invalid_appointment_types,
    (SELECT COUNT(*) FROM "Billing" WHERE
      "Total_Amount" < 0 OR "Insured_Amount" < 0 OR "Patient_Amount" < 0
      OR "Total_Amount" <> "Insured_Amount" + "Patient_Amount"
    )::int AS invalid_bills,
    (SELECT COUNT(*) FROM "Patient_Insurance" WHERE "Status" NOT IN (
      'Pending', 'Approved', 'Rejected'
    ))::int AS invalid_patient_insurance_statuses,
    (SELECT COUNT(*) FROM (
      SELECT "User_ID" FROM "Staff" GROUP BY "User_ID" HAVING COUNT(*) > 1
    ) duplicates)::int AS duplicate_staff_profiles,
    (SELECT COUNT(*) FROM "User" user_account
      LEFT JOIN "Patient" patient ON patient.user_id = user_account.user_id
      WHERE user_account.user_type = 'patient' AND patient.patient_id IS NULL
    )::int AS missing_patient_profiles,
    (SELECT COUNT(*) FROM "User" user_account
      LEFT JOIN "Staff" staff ON staff."User_ID" = user_account.user_id
      WHERE user_account.user_type <> 'patient' AND staff."Staff_ID" IS NULL
    )::int AS missing_staff_profiles,
    (SELECT COUNT(*) FROM "User" user_account
      JOIN "Staff" staff ON staff."User_ID" = user_account.user_id
      LEFT JOIN "Doctor" doctor ON doctor."Staff_ID" = staff."Staff_ID"
      WHERE user_account.user_type = 'doctor' AND doctor."Doctor_ID" IS NULL
    )::int AS missing_doctor_profiles,
    (SELECT COUNT(*) FROM "Appointment" appointment
      LEFT JOIN "Doctor_Appointment" doctor_appointment
        ON doctor_appointment."Appointment_ID" = appointment."Appointment_ID"
      WHERE appointment."Type" = 'Consultation'
        AND doctor_appointment."Appointment_ID" IS NULL
    )::int AS consultation_appointments_without_doctors,
    (SELECT COUNT(*) FROM "Appointment" appointment
      LEFT JOIN "Billing" billing ON billing."Appointment_ID" = appointment."Appointment_ID"
      WHERE billing."Bill_ID" IS NULL
    )::int AS appointments_without_bills,
    (SELECT COUNT(*) FROM "Billing" billing
      LEFT JOIN "Appointment" appointment ON appointment."Appointment_ID" = billing."Appointment_ID"
      WHERE appointment."Appointment_ID" IS NULL
    )::int AS orphaned_bills,
    (SELECT COUNT(*) FROM billing_summary WHERE total_paid > "Patient_Amount")::int AS overpaid_bills
`);

for (const [name, value] of Object.entries(invalidValues[0])) {
  if (Number(value) !== 0) problems.push(`${name}: ${value}`);
}

const migrations = await sql.query(`
  SELECT version, name, applied_at
  FROM schema_migrations
  ORDER BY version
`);

if (problems.length > 0) {
  console.error('Database validation failed:');
  for (const problem of problems) console.error(`- ${problem}`);
  process.exitCode = 1;
} else {
  console.log(`Database validation passed (${available.size} tables, ${migrations.length} migrations).`);
  for (const migration of migrations) {
    console.log(`- ${migration.version}: ${migration.name}`);
  }
}
