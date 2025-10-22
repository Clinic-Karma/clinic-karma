// backend/src/models/topmanager.js
import { sql } from './db.js';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

// Create
export async function createTopManager(data) {
  const {
    name,
    email,
    phone = null,
    password = null,
    password_hash = null,
    address = null,
    NIC = null,
    username = null,
    user_type = 'top_manager',
    is_active = true,
  } = data;

  // Hash the password if provided as plain text
  let hashedPassword = password_hash;
  if (password && !password_hash) {
    hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  }

  const rows = await sql`
    INSERT INTO "top_managers"
      ("name","email","phone","password_hash","address","NIC","username","user_type","is_active")
    VALUES
      (${name},${email},${phone},${hashedPassword},${address},${NIC},${username},${user_type},${is_active})
    RETURNING *;
  `;
  return rows[0];
}

// Read by id
export async function getTopManagerById(id) {
  const rows = await sql`
    SELECT * FROM "top_managers"
    WHERE "id" = ${id}
    LIMIT 1;
  `;
  return rows[0] || null;
}

// Read all (with optional filters)
export async function getAllTopManagers({ search = '', is_active = null } = {}) {
  let where = sql``;

  if (is_active !== null) where = sql`${where} AND "is_active" = ${is_active}`;
  if (search)
    where = sql`${where} AND (
      "name" ILIKE ${'%' + search + '%'}
      OR "email" ILIKE ${'%' + search + '%'}
      OR "phone" ILIKE ${'%' + search + '%'}
    )`;

  const rows = await sql`
    SELECT * FROM "top_managers"
    WHERE TRUE ${where}
    ORDER BY "created_at" DESC;
  `;
  return rows;
}

// Update (partial)
export async function updateTopManager(id, fields = {}) {
  const entries = Object.entries(fields);
  if (!entries.length) return getTopManagerById(id);

  // Hash password if it's being updated
  if (fields.password) {
    fields.password_hash = await bcrypt.hash(fields.password, SALT_ROUNDS);
    delete fields.password;
  }

  const updatedEntries = Object.entries(fields);
  const setClauses = updatedEntries.map(([k, v]) => sql`${sql.unsafe('"' + k + '"')} = ${v}`);

  const rows = await sql`
    UPDATE "top_managers"
    SET ${sql.join(setClauses, sql`, `)}, "updated_at" = NOW()
    WHERE "id" = ${id}
    RETURNING *;
  `;
  return rows[0] || null;
}

// Soft delete
export async function softDeleteTopManager(id) {
  const rows = await sql`
    UPDATE "top_managers"
    SET "is_active" = false, "updated_at" = NOW()
    WHERE "id" = ${id}
    RETURNING *;
  `;
  return rows[0] || null;
}

// Hard delete
export async function deleteTopManager(id) {
  await sql`DELETE FROM "top_managers" WHERE "id" = ${id};`;
  return true;
}

// ====== Top Manager Dashboard Data Queries ======

// Revenue trends by month (sum of Billing amounts per month from Appointment dates)
export async function getRevenueTrends() {
  const rows = await sql`
    SELECT 
      TO_CHAR(a."Appointment_Date", 'Mon') AS month_short,
      DATE_TRUNC('month', a."Appointment_Date") AS month_start,
      COALESCE(SUM(b."Total_Amount"), 0) AS monthly_total
    FROM "Appointment" a
    LEFT JOIN "Billing" b ON b."Appointment_ID" = a."Appointment_ID"
    GROUP BY month_short, month_start
    ORDER BY month_start
  `;
  return rows;
}

// Pending payments: bills where the patient amount is not equal to zero
export async function getPendingPayments() {
  const rows = await sql`
    SELECT 
      u.name AS patient,
      p.patient_id,
      u.contact_number AS patient_phone,
      u.email AS patient_email,
      COALESCE(b."Total_Amount", 0) AS total_amount,
      COALESCE(b."Patient_Amount", b."Total_Amount", 0) AS amount,
      COALESCE(b."Patient_Amount", b."Total_Amount", 0) AS remaining,
      b."Due_Date" AS due_date,
      b."Bill_ID" AS bill_id,
      a."Appointment_ID" AS appointment_id,
      a."Appointment_Date" AS appointment_date
    FROM "Billing" b
    JOIN "Appointment" a ON a."Appointment_ID" = b."Appointment_ID"
    JOIN "Patient" p ON a."Patient_ID" = p.patient_id
    JOIN "User" u ON p.user_id = u.user_id
    WHERE COALESCE(b."Patient_Amount", b."Total_Amount", 0) != 0
    ORDER BY b."Due_Date" DESC, a."Appointment_Date" DESC
  `;
  return rows;
}

// Bills list for top manager view
export async function getAllBillsForTopManager() {
  const rows = await sql`
    SELECT 
      b."Bill_ID" AS bill_id,
      b."Total_Amount" AS total_amount,
      a."Appointment_ID" AS appointment_id,
      a."Appointment_Date" AS appointment_date,
      u.name AS patient_name
    FROM "Billing" b
    JOIN "Appointment" a ON b."Appointment_ID" = a."Appointment_ID"
    JOIN "Patient" p ON a."Patient_ID" = p.patient_id
    JOIN "User" u ON p.user_id = u.user_id
    ORDER BY a."Appointment_Date" DESC
  `;
  return rows;
}

// Appointments list for top manager view
export async function getAllAppointmentsForTopManager() {
  const rows = await sql`
    SELECT 
      a."Appointment_ID",
      a."Appointment_Date",
      a."Status",
      u.name AS patient_name
    FROM "Appointment" a
    JOIN "Patient" p ON a."Patient_ID" = p.patient_id
    JOIN "User" u ON p.user_id = u.user_id
    ORDER BY a."Appointment_Date" DESC
  `;
  return rows;
}

// Insurance claims summary by status
export async function getInsuranceClaimsSummary() {
  const rows = await sql`
    SELECT 
      COALESCE(ic."Claim_Status", 'Pending') AS status,
      COUNT(*)::int AS count
    FROM "Insurance_Claim" ic
    GROUP BY COALESCE(ic."Claim_Status", 'Pending')
  `;
  return rows;
}