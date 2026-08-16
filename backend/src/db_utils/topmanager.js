import { sql } from './db.js';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export async function createTopManager(data) {
  const {
    name, email, phone = null, password = null, password_hash = null,
    address = null, NIC = null, nic = NIC, username = email, is_active = true,
  } = data;
  const hashedPassword = password_hash || (password ? await bcrypt.hash(password, SALT_ROUNDS) : null);
  if (!hashedPassword) throw new Error('A password is required');

  const rows = await sql`
    WITH new_user AS (
      INSERT INTO "User" (
        name, email, contact_number, password_hash, address, nic,
        username, user_type, is_active
      ) VALUES (
        ${name}, ${email}, ${phone}, ${hashedPassword}, ${address}, ${nic},
        ${username}, 'top-manager', ${is_active}
      )
      RETURNING *
    ),
    new_staff AS (
      INSERT INTO "Staff" ("User_ID", "Branch_Name")
      SELECT user_id, NULL FROM new_user
    )
    SELECT
      user_id AS id, name, email, contact_number AS phone, address,
      nic AS "NIC", username, user_type, is_active, created_at, updated_at
    FROM new_user
  `;
  return rows[0];
}

export async function getTopManagerById(id) {
  const rows = await sql`
    SELECT user_account.user_id AS id, user_account.name, user_account.email,
           user_account.contact_number AS phone, user_account.address,
           user_account.nic AS "NIC", user_account.username, user_account.user_type,
           user_account.is_active, user_account.created_at, user_account.updated_at
    FROM "User" user_account
    WHERE user_account.user_id = ${id} AND user_account.user_type = 'top-manager'
    LIMIT 1
  `;
  return rows[0] || null;
}

export async function getAllTopManagers({ search = '', is_active = null } = {}) {
  return sql`
    SELECT user_account.user_id AS id, user_account.name, user_account.email,
           user_account.contact_number AS phone, user_account.address,
           user_account.nic AS "NIC", user_account.username, user_account.user_type,
           user_account.is_active, user_account.created_at, user_account.updated_at
    FROM "User" user_account
    WHERE user_account.user_type = 'top-manager'
      AND (${is_active}::boolean IS NULL OR user_account.is_active = ${is_active})
      AND (
        ${search} = '' OR user_account.name ILIKE ${`%${search}%`}
        OR user_account.email ILIKE ${`%${search}%`}
        OR user_account.contact_number ILIKE ${`%${search}%`}
      )
    ORDER BY user_account.created_at DESC
  `;
}

export async function updateTopManager(id, fields = {}) {
  const updates = [];
  const mapping = {
    name: 'name', email: 'email', phone: 'contact_number', contact_number: 'contact_number',
    address: 'address', NIC: 'nic', nic: 'nic', username: 'username', is_active: 'is_active',
  };

  if (fields.password) fields.password_hash = await bcrypt.hash(fields.password, SALT_ROUNDS);
  if (fields.password_hash) updates.push(sql`password_hash = ${fields.password_hash}`);
  for (const [inputName, columnName] of Object.entries(mapping)) {
    if (Object.hasOwn(fields, inputName)) {
      updates.push(sql`${sql.unsafe(columnName)} = ${fields[inputName]}`);
    }
  }
  if (!updates.length) return getTopManagerById(id);

  const rows = await sql`
    UPDATE "User"
    SET ${sql.join(updates, sql`, `)}
    WHERE user_id = ${id} AND user_type = 'top-manager'
    RETURNING user_id AS id, name, email, contact_number AS phone, address,
              nic AS "NIC", username, user_type, is_active, created_at, updated_at
  `;
  return rows[0] || null;
}

export async function softDeleteTopManager(id) {
  return updateTopManager(id, { is_active: false });
}

export async function deleteTopManager(id) {
  const [staffRows, userRows] = await sql.transaction((transaction) => [
    transaction`DELETE FROM "Staff" WHERE "User_ID" = ${id}`,
    transaction`DELETE FROM "User" WHERE user_id = ${id} AND user_type = 'top-manager' RETURNING user_id`,
  ]);
  void staffRows;
  return userRows.length > 0;
}

export async function getRevenueTrends() {
  return sql`
    SELECT
      TO_CHAR(appointment."Appointment_Date", 'Mon') AS month_short,
      DATE_TRUNC('month', appointment."Appointment_Date") AS month_start,
      COALESCE(SUM(billing."Total_Amount"), 0) AS monthly_total
    FROM "Appointment" appointment
    LEFT JOIN "Billing" billing ON billing."Appointment_ID" = appointment."Appointment_ID"
    GROUP BY month_short, month_start
    ORDER BY month_start
  `;
}

export async function getPendingPayments() {
  return sql`
    SELECT
      user_account.name AS patient,
      patient.patient_id,
      user_account.contact_number AS patient_phone,
      user_account.email AS patient_email,
      billing."Total_Amount" AS total_amount,
      billing."Patient_Amount" AS amount,
      GREATEST(billing."Patient_Amount" - COALESCE(SUM(payment."Amount"), 0), 0) AS remaining,
      billing."Due_Date" AS due_date,
      billing."Bill_ID" AS bill_id,
      appointment."Appointment_ID" AS appointment_id,
      appointment."Appointment_Date" AS appointment_date
    FROM "Billing" billing
    JOIN "Appointment" appointment ON appointment."Appointment_ID" = billing."Appointment_ID"
    JOIN "Patient" patient ON appointment."Patient_ID" = patient.patient_id
    JOIN "User" user_account ON patient.user_id = user_account.user_id
    LEFT JOIN "Payment" payment ON payment."Bill_ID" = billing."Bill_ID"
    GROUP BY billing."Bill_ID", appointment."Appointment_ID", patient.patient_id, user_account.user_id
    HAVING GREATEST(billing."Patient_Amount" - COALESCE(SUM(payment."Amount"), 0), 0) > 0
    ORDER BY billing."Due_Date", appointment."Appointment_Date"
  `;
}

export async function getAllBillsForTopManager() {
  return sql`
    SELECT billing."Bill_ID" AS bill_id, billing."Total_Amount" AS total_amount,
           appointment."Appointment_ID" AS appointment_id,
           appointment."Appointment_Date" AS appointment_date,
           user_account.name AS patient_name
    FROM "Billing" billing
    JOIN "Appointment" appointment ON billing."Appointment_ID" = appointment."Appointment_ID"
    JOIN "Patient" patient ON appointment."Patient_ID" = patient.patient_id
    JOIN "User" user_account ON patient.user_id = user_account.user_id
    ORDER BY appointment."Appointment_Date" DESC
  `;
}

export async function getAllAppointmentsForTopManager() {
  return sql`
    SELECT appointment."Appointment_ID", appointment."Appointment_Date", appointment."Status",
           user_account.name AS patient_name
    FROM "Appointment" appointment
    JOIN "Patient" patient ON appointment."Patient_ID" = patient.patient_id
    JOIN "User" user_account ON patient.user_id = user_account.user_id
    ORDER BY appointment."Appointment_Date" DESC
  `;
}

export async function getInsuranceClaimsSummary() {
  return sql`
    SELECT COALESCE("Claim_Status", 'Pending') AS status, COUNT(*)::int AS count
    FROM "Insurance_Claim"
    GROUP BY COALESCE("Claim_Status", 'Pending')
  `;
}
