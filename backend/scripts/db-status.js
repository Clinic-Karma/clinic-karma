import { sql } from '../src/db_utils/db.js';

const tables = await sql.query(`
  SELECT table_name
  FROM information_schema.tables
  WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
  ORDER BY table_name
`);

const migrationsTable = tables.some(({ table_name: tableName }) => tableName === 'schema_migrations');
const migrations = migrationsTable
  ? await sql.query(`
      SELECT version, name, applied_at
      FROM schema_migrations
      ORDER BY version
    `)
  : [];

const columns = await sql.query(`
  SELECT table_name, column_name, data_type, is_nullable, column_default
  FROM information_schema.columns
  WHERE table_schema = 'public'
  ORDER BY table_name, ordinal_position
`);

const constraints = await sql.query(`
  SELECT
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type
  FROM information_schema.table_constraints tc
  WHERE tc.table_schema = 'public'
  ORDER BY tc.table_name, tc.constraint_type, tc.constraint_name
`);

const approximateRows = await sql.query(`
  SELECT relname AS table_name, n_live_tup::bigint AS approximate_rows
  FROM pg_stat_user_tables
  ORDER BY relname
`);

const dataValues = {
  userRoles: await sql.query('SELECT user_type, COUNT(*)::int AS count FROM "User" GROUP BY user_type ORDER BY user_type'),
  appointmentStatuses: await sql.query('SELECT "Status" AS value, COUNT(*)::int AS count FROM "Appointment" GROUP BY "Status" ORDER BY "Status"'),
  appointmentTypes: await sql.query('SELECT "Type" AS value, COUNT(*)::int AS count FROM "Appointment" GROUP BY "Type" ORDER BY "Type"'),
  billingStatuses: await sql.query('SELECT "Status" AS value, COUNT(*)::int AS count FROM "Billing" GROUP BY "Status" ORDER BY "Status"'),
  insuranceStatuses: await sql.query('SELECT "Status" AS value, COUNT(*)::int AS count FROM "Patient_Insurance" GROUP BY "Status" ORDER BY "Status"'),
};

const integrity = {
  users: (await sql.query(`
    SELECT
      COUNT(*) FILTER (WHERE username IS NULL OR BTRIM(username) = '')::int AS missing_usernames,
      COUNT(*) FILTER (WHERE password_hash IS NULL OR BTRIM(password_hash) = '')::int AS missing_password_hashes,
      COUNT(*) FILTER (WHERE user_type IS NULL OR BTRIM(user_type) = '')::int AS missing_roles,
      COUNT(*)::int - COUNT(DISTINCT LOWER(username))::int AS duplicate_usernames,
      COUNT(nic)::int - COUNT(DISTINCT nic)::int AS duplicate_nics
    FROM "User"
  `))[0],
  profileDuplicates: (await sql.query(`
    SELECT
      (SELECT COUNT(*)::int - COUNT(DISTINCT user_id)::int FROM "Patient") AS duplicate_patient_users,
      (SELECT COUNT(*)::int - COUNT(DISTINCT "User_ID")::int FROM "Staff") AS duplicate_staff_users,
      (SELECT COUNT(*)::int - COUNT(DISTINCT "Appointment_ID")::int FROM "Billing") AS duplicate_appointment_bills
  `))[0],
  staffDuplicateUsers: await sql.query(`
    SELECT s."User_ID" AS user_id, MAX(u.user_type) AS user_type,
           ARRAY_AGG(s."Staff_ID" ORDER BY s."Staff_ID") AS staff_ids,
           ARRAY_AGG(s."Branch_Name" ORDER BY s."Staff_ID") AS branches,
           ARRAY_REMOVE(ARRAY_AGG(d."Doctor_ID" ORDER BY d."Doctor_ID"), NULL) AS doctor_ids
    FROM "Staff" s
    JOIN "User" u ON u.user_id = s."User_ID"
    LEFT JOIN "Doctor" d ON d."Staff_ID" = s."Staff_ID"
    GROUP BY s."User_ID"
    HAVING COUNT(*) > 1
  `),
  billing: (await sql.query(`
    SELECT
      COUNT(*) FILTER (WHERE "Insurance_ID" IS NOT NULL)::int AS non_null_legacy_insurance_dates,
      COUNT(*) FILTER (
        WHERE COALESCE("Total_Amount", 0) < 0
           OR COALESCE("Insured_Amount", 0) < 0
           OR COALESCE("Patient_Amount", 0) < 0
      )::int AS negative_amount_rows,
      COUNT(*) FILTER (
        WHERE COALESCE("Total_Amount", 0)
          <> COALESCE("Insured_Amount", 0) + COALESCE("Patient_Amount", 0)
      )::int AS unbalanced_rows
    FROM "Billing"
  `))[0],
  clinical: (await sql.query(`
    SELECT
      COUNT(*) FILTER (WHERE doctor_appointment."Doctor_ID" IS NULL)::int AS missing_doctors,
      COUNT(*) FILTER (WHERE doctor_appointment."Start_Time" IS NULL)::int AS missing_start_times,
      COUNT(*) FILTER (WHERE doctor_appointment."Specialization_ID" IS NULL)::int AS missing_specializations,
      COUNT(*) FILTER (WHERE doctor_specialization."Doctor_ID" IS NULL)::int AS invalid_doctor_specialization_pairs
    FROM "Doctor_Appointment" doctor_appointment
    LEFT JOIN "Doctor_Specialization" doctor_specialization
      ON doctor_specialization."Doctor_ID" = doctor_appointment."Doctor_ID"
     AND doctor_specialization."Specialization_ID" = doctor_appointment."Specialization_ID"
  `))[0],
};

console.log(JSON.stringify({
  connected: true,
  tableCount: tables.length,
  tables: tables.map(({ table_name: tableName }) => tableName),
  columns,
  constraints,
  approximateRows,
  dataValues,
  integrity,
  migrations,
}, null, 2));
