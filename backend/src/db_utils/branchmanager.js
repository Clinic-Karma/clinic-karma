// backend/src/db_utils/branchmanager.js
import { sql } from './db.js';

// Create branch manager
export async function createBranchManager(data) {
  const {
    name,
    email,
    phone = null,
    password_hash = null,
    address = null,
    NIC = null,
    username = null,
    user_type = null,
    branch_id = null,
    is_active = true,
  } = data;

  try {
    const result = await sql`
      INSERT INTO "branch_managers" 
        ("name", "email", "phone", "password_hash", "address", "NIC", "username", "user_type", "branch_id", "is_active")
      VALUES 
        (${name}, ${email}, ${phone}, ${password_hash}, ${address}, ${NIC}, ${username}, ${user_type}, ${branch_id}, ${is_active})
      RETURNING *;
    `;
    return result[0];
  } catch (error) {
    console.error('Error creating branch manager:', error);
    throw error;
  }
}

// Get branch manager by ID
export async function getBranchManagerById(id) {
  try {
    const result = await sql`
      SELECT * FROM "branch_managers"
      WHERE "id" = ${id}
      LIMIT 1;
    `;
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching branch manager by ID:', error);
    throw error;
  }
}

// Get all branch managers (optional filters)
export async function getAllBranchManagers({ search = '', branch_id = null, is_active = null } = {}) {
  try {
    let whereClauses = sql``;

    if (branch_id !== null) {
      whereClauses = sql`${whereClauses} AND "branch_id" = ${branch_id}`;
    }

    if (is_active !== null) {
      whereClauses = sql`${whereClauses} AND "is_active" = ${is_active}`;
    }

    if (search) {
      whereClauses = sql`${whereClauses} AND (
        "name" ILIKE ${'%' + search + '%'} OR
        "email" ILIKE ${'%' + search + '%'} OR
        "phone" ILIKE ${'%' + search + '%'}
      )`;
    }

    const result = await sql`
      SELECT * FROM "branch_managers"
      WHERE TRUE ${whereClauses}
      ORDER BY "created_at" DESC;
    `;
    return result;
  } catch (error) {
    console.error('Error fetching branch managers:', error);
    throw error;
  }
}

// Update branch manager
export async function updateBranchManager(id, data) {
  const fields = Object.entries(data);
  if (fields.length === 0) return getBranchManagerById(id);

  try {
    const setClauses = fields.map(
      ([key, value], index) => sql`${sql.unsafe('"' + key + '"')} = ${value}`
    );

    const result = await sql`
      UPDATE "branch_managers"
      SET ${sql.join(setClauses, sql`, `)}, "updated_at" = NOW()
      WHERE "id" = ${id}
      RETURNING *;
    `;
    return result[0] || null;
  } catch (error) {
    console.error('Error updating branch manager:', error);
    throw error;
  }
}

// Soft delete (deactivate)
export async function softDeleteBranchManager(id) {
  try {
    const result = await sql`
      UPDATE "branch_managers"
      SET "is_active" = false, "updated_at" = NOW()
      WHERE "id" = ${id}
      RETURNING *;
    `;
    return result[0] || null;
  } catch (error) {
    console.error('Error soft deleting branch manager:', error);
    throw error;
  }
}

// Hard delete (permanent)
export async function deleteBranchManager(id) {
  try {
    await sql`
      DELETE FROM "branch_managers"
      WHERE "id" = ${id};
    `;
    return true;
  } catch (error) {
    console.error('Error deleting branch manager:', error);
    throw error;
  }
}

// ===== DOCTOR MANAGEMENT FUNCTIONS =====

// Get all doctors with their details
export async function getAllDoctorsForBranchManager() {
  try {
    const result = await sql`
      SELECT 
        d."Doctor_ID" as id,
        u.name,
        u.username,
        s."Branch_Name" as branch,
        u.user_type
      FROM "Doctor" d
      JOIN "Staff" s ON d."Staff_ID" = s."Staff_ID"
      JOIN "User" u ON s."User_ID" = u.user_id
      ORDER BY u.name
    `;
    return result;
  } catch (error) {
    console.error('Error fetching doctors for branch manager:', error);
    throw error;
  }
}

// Create a new doctor
export async function createDoctorForBranchManager(data) {
  const {
    name,
    specialization,
    address,
    username,
    password,
    contact,
    email,
    nic,
    branch = 'Colombo' // Default branch
  } = data;

  try {
    // Start transaction
    const result = await sql.begin(async sql => {
      // 1. Create user first
      const userResult = await sql`
        INSERT INTO "User" (name, nic, contact_number, email, address, username, password_hash, user_type)
        VALUES (${name}, ${nic}, ${contact}, ${email}, ${address}, ${username}, ${password}, 'doctor')
        RETURNING user_id
      `;
      
      const userId = userResult[0].user_id;

      // 2. Create staff record
      const staffResult = await sql`
        INSERT INTO "Staff" ("User_ID", "Branch_Name")
        VALUES (${userId}, ${branch})
        RETURNING "Staff_ID"
      `;
      
      const staffId = staffResult[0].Staff_ID;

      // 3. Create doctor record
      const doctorResult = await sql`
        INSERT INTO "Doctor" ("Staff_ID")
        VALUES (${staffId})
        RETURNING "Doctor_ID"
      `;
      
      const doctorId = doctorResult[0].Doctor_ID;

      // 4. Add specialization if provided
      if (specialization) {
        const specResult = await sql`
          SELECT "Specialization_ID" FROM "Specialization" 
          WHERE "Specialization_Name" = ${specialization}
        `;
        
        if (specResult.length > 0) {
          await sql`
            INSERT INTO "Doctor_Specialization" ("Doctor_ID", "Specialization_ID")
            VALUES (${doctorId}, ${specResult[0].Specialization_ID})
          `;
        }
      }

      return { userId, staffId, doctorId };
    });

    return result;
  } catch (error) {
    console.error('Error creating doctor:', error);
    throw error;
  }
}

// ===== STAFF MANAGEMENT FUNCTIONS =====

// Get all staff (receptionists and lab coordinators)
export async function getAllStaffForBranchManager() {
  try {
    const result = await sql`
      SELECT 
        s."Staff_ID" as id,
        u.name,
        u.username,
        s."Branch_Name" as branch,
        CASE 
          WHEN u.user_type = 'receptionist' THEN 'Receptionist'
          WHEN u.user_type = 'lab-assistant' THEN 'Lab Coordinator'
          ELSE u.user_type
        END as role
      FROM "Staff" s
      JOIN "User" u ON s."User_ID" = u.user_id
      WHERE u.user_type IN ('receptionist', 'lab-assistant')
      ORDER BY u.name
    `;
    return result;
  } catch (error) {
    console.error('Error fetching staff for branch manager:', error);
    throw error;
  }
}

// Create a new staff member
export async function createStaffForBranchManager(data) {
  const {
    name,
    role,
    address,
    username,
    password,
    contact,
    email,
    nic,
    branch = 'Colombo' // Default branch
  } = data;

  try {
    // Create staff without transaction (neon serverless doesn't support transactions)
    // 1. Create user first - let database handle auto-increment
    const userResult = await sql`
      INSERT INTO "User" (name, nic, contact_number, address, username, password_hash, user_type, email)
      VALUES (${name}, ${nic}, ${contact}, ${address}, ${username}, ${password}, ${role}, ${email || null})
      RETURNING user_id
    `;
    
    const userId = userResult[0].user_id;

    // 2. Create staff record - let database handle auto-increment
    const staffResult = await sql`
      INSERT INTO "Staff" ("User_ID", "Branch_Name")
      VALUES (${userId}, ${branch})
      RETURNING "Staff_ID"
    `;
    
    const staffId = staffResult[0].Staff_ID;

    return { userId, staffId };
  } catch (error) {
    console.error('Error creating staff:', error);
    throw error;
  }
}

// Get all specializations for doctor registration
export async function getSpecializationsForBranchManager() {
  try {
    const result = await sql`
      SELECT 
        "Specialization_ID" as id,
        "Specialization_Name" as name
      FROM "Specialization"
      ORDER BY "Specialization_Name"
    `;
    return result;
  } catch (error) {
    console.error('Error fetching specializations:', error);
    throw error;
  }
}
