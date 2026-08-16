import { sql } from '../src/db_utils/db.js';

const candidates = await sql.query(`
  SELECT patient.patient_id,
         doctor."Doctor_ID" AS doctor_id,
         doctor_specialization."Specialization_ID" AS specialization_id,
         staff."Branch_Name" AS branch_name,
         candidate_date::date AS appointment_date
  FROM "Patient" patient
  CROSS JOIN "Doctor" doctor
  JOIN "Staff" staff ON staff."Staff_ID" = doctor."Staff_ID" AND staff."Is_Active" = true
  JOIN "Doctor_Specialization" doctor_specialization
    ON doctor_specialization."Doctor_ID" = doctor."Doctor_ID"
  CROSS JOIN LATERAL generate_series(CURRENT_DATE + 30, CURRENT_DATE + 365, interval '1 day') candidate_date
  WHERE NOT EXISTS (
    SELECT 1 FROM "Appointment" appointment
    WHERE appointment."Patient_ID" = patient.patient_id
      AND appointment."Appointment_Date" = candidate_date::date
      AND appointment."Status" <> 'Cancelled'
  )
  ORDER BY candidate_date
  LIMIT 1
`);

if (!candidates[0]) throw new Error('No patient/doctor/specialization combination is available for verification.');
const candidate = candidates[0];

const before = await sql`
  SELECT COUNT(*)::int AS count
  FROM "Appointment"
  WHERE "Patient_ID" = ${candidate.patient_id}
    AND "Appointment_Date" = ${candidate.appointment_date}
`;

try {
  await sql.transaction([
    sql`
      SELECT * FROM book_consultation(
        ${candidate.patient_id}, ${candidate.doctor_id}, ${candidate.appointment_date},
        '13:37', ${candidate.branch_name}, ${candidate.specialization_id}, 'Scheduled'
      )
    `,
    sql`SELECT 1 / 0`,
  ], { isolationLevel: 'Serializable' });
  throw new Error('Rollback probe unexpectedly committed.');
} catch (error) {
  if (error.code !== '22012') throw error;
}

const after = await sql`
  SELECT COUNT(*)::int AS count
  FROM "Appointment"
  WHERE "Patient_ID" = ${candidate.patient_id}
    AND "Appointment_Date" = ${candidate.appointment_date}
`;

if (before[0].count !== after[0].count) {
  throw new Error('Transactional booking rollback verification failed.');
}

console.log('Database write verification passed (booking and forced rollback were atomic).');
