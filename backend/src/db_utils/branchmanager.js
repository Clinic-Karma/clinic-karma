// backend/src/db_utils/branchmanager.js
import { sql } from './db.js';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

// Create branch manager
export async function createBranchManager(data) {
  const {
    name,
    email,
    phone = null,
    password = null,
    password_hash = null,
    address = null,
    NIC = null,
    username = null,
    user_type = null,
    branch_id = null,
    is_active = true,
  } = data;

  try {
    const hashedPassword = password_hash || (password ? await bcrypt.hash(password, SALT_ROUNDS) : null);
    if (!hashedPassword) throw new Error('A password is required');
    const managerUsername = username || email;
    const managerBranch = branch_id || data.branch || data.branch_name;
    if (!managerBranch) throw new Error('A branch is required');

    const result = await sql`
      WITH new_user AS (
        INSERT INTO "User" (
          name, email, contact_number, password_hash, address, nic,
          username, user_type, is_active
        ) VALUES (
          ${name}, ${email}, ${phone}, ${hashedPassword}, ${address}, ${NIC},
          ${managerUsername}, 'branch-manager', ${is_active}
        )
        RETURNING *
      ),
      new_staff AS (
        INSERT INTO "Staff" ("User_ID", "Branch_Name")
        SELECT user_id, ${managerBranch} FROM new_user
        RETURNING "Branch_Name"
      )
      SELECT user_id AS id, name, email, contact_number AS phone, address,
             nic AS "NIC", username, user_type, is_active,
             (SELECT "Branch_Name" FROM new_staff) AS branch_id,
             created_at, updated_at
      FROM new_user
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
      SELECT user_account.user_id AS id, user_account.name, user_account.email,
             user_account.contact_number AS phone, user_account.address,
             user_account.nic AS "NIC", user_account.username, user_account.user_type,
             staff."Branch_Name" AS branch_id, user_account.is_active,
             user_account.created_at, user_account.updated_at
      FROM "User" user_account
      JOIN "Staff" staff ON staff."User_ID" = user_account.user_id
      WHERE user_account.user_id = ${id} AND user_account.user_type = 'branch-manager'
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
    const result = await sql`
      SELECT user_account.user_id AS id, user_account.name, user_account.email,
             user_account.contact_number AS phone, user_account.address,
             user_account.nic AS "NIC", user_account.username, user_account.user_type,
             staff."Branch_Name" AS branch_id, user_account.is_active,
             user_account.created_at, user_account.updated_at
      FROM "User" user_account
      JOIN "Staff" staff ON staff."User_ID" = user_account.user_id
      WHERE user_account.user_type = 'branch-manager'
        AND (${branch_id}::text IS NULL OR staff."Branch_Name" = ${branch_id})
        AND (${is_active}::boolean IS NULL OR user_account.is_active = ${is_active})
        AND (
          ${search} = '' OR user_account.name ILIKE ${`%${search}%`}
          OR user_account.email ILIKE ${`%${search}%`}
          OR user_account.contact_number ILIKE ${`%${search}%`}
        )
      ORDER BY user_account.created_at DESC;
    `;
    return result;
  } catch (error) {
    console.error('Error fetching branch managers:', error);
    throw error;
  }
}

// Update branch manager
export async function updateBranchManager(id, data) {
  try {
    if (Object.keys(data).length === 0) return getBranchManagerById(id);
    const hashedPassword = data.password
      ? await bcrypt.hash(data.password, SALT_ROUNDS)
      : data.password_hash;
    const branch = data.branch_id ?? data.branch ?? data.branch_name;
    const result = await sql`
      WITH updated_user AS (
        UPDATE "User"
        SET name = CASE WHEN ${Object.hasOwn(data, 'name')} THEN ${data.name ?? null} ELSE name END,
            email = CASE WHEN ${Object.hasOwn(data, 'email')} THEN ${data.email ?? null} ELSE email END,
            contact_number = CASE WHEN ${Object.hasOwn(data, 'phone') || Object.hasOwn(data, 'contact_number')}
                                  THEN ${data.phone ?? data.contact_number ?? null} ELSE contact_number END,
            address = CASE WHEN ${Object.hasOwn(data, 'address')} THEN ${data.address ?? null} ELSE address END,
            nic = CASE WHEN ${Object.hasOwn(data, 'NIC') || Object.hasOwn(data, 'nic')}
                       THEN ${data.NIC ?? data.nic ?? null} ELSE nic END,
            username = CASE WHEN ${Object.hasOwn(data, 'username')} THEN ${data.username ?? null} ELSE username END,
            is_active = CASE WHEN ${Object.hasOwn(data, 'is_active')} THEN ${data.is_active ?? null} ELSE is_active END,
            password_hash = CASE WHEN ${Boolean(hashedPassword)} THEN ${hashedPassword ?? null} ELSE password_hash END
        WHERE user_id = ${id} AND user_type = 'branch-manager'
        RETURNING *
      ),
      updated_staff AS (
        UPDATE "Staff"
        SET "Branch_Name" = CASE WHEN ${branch !== undefined} THEN ${branch ?? null} ELSE "Branch_Name" END
        WHERE "User_ID" = ${id}
        RETURNING "Branch_Name"
      )
      SELECT user_id AS id, name, email, contact_number AS phone, address,
             nic AS "NIC", username, user_type, is_active,
             (SELECT "Branch_Name" FROM updated_staff) AS branch_id,
             created_at, updated_at
      FROM updated_user;
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
      UPDATE "User"
      SET is_active = false
      WHERE user_id = ${id} AND user_type = 'branch-manager'
      RETURNING user_id AS id, name, email, contact_number AS phone, address,
                nic AS "NIC", username, user_type, is_active, created_at, updated_at;
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
    const [, userRows] = await sql.transaction((transaction) => [
      transaction`DELETE FROM "Staff" WHERE "User_ID" = ${id}`,
      transaction`DELETE FROM "User" WHERE user_id = ${id} AND user_type = 'branch-manager' RETURNING user_id`,
    ]);
    return userRows.length > 0;
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
    nic,
    branch = 'Colombo' // Default branch
  } = data;

  try {
    // Hash the password before storing
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Sanitize phone number to fit database constraint (VARCHAR 15)
    let sanitizedContact = contact.replace(/[\s\-\(\)]/g, '');
    if (sanitizedContact.length > 15) {
      sanitizedContact = sanitizedContact.substring(0, 15);
    }

    // Start transaction
    const result = await sql.begin(async sql => {
      // 1. Create user first
      const userResult = await sql`
        INSERT INTO "User" (name, nic, contact_number, address, username, password_hash, user_type)
        VALUES (${name}, ${nic}, ${sanitizedContact}, ${address}, ${username}, ${passwordHash}, 'doctor')
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
      if (specialization && specialization.trim() !== '') {
        const specResult = await sql`
          SELECT "Specialization_ID" FROM "Specialization" 
          WHERE LOWER("Specialization_Name") = LOWER(${specialization})
        `;
        
        if (specResult.length > 0) {
          await sql`
            INSERT INTO "Doctor_Specialization" ("Doctor_ID", "Specialization_ID")
            VALUES (${doctorId}, ${specResult[0].Specialization_ID})
          `;
        } else {
          console.warn(`Specialization not found: ${specialization}`);
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
          WHEN u.user_type = 'lab-coordinator' THEN 'Lab Coordinator'
          ELSE u.user_type
        END as role
      FROM "Staff" s
      JOIN "User" u ON s."User_ID" = u.user_id
      WHERE u.user_type IN ('receptionist', 'lab-coordinator')
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
    // Hash the password before storing
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Sanitize phone number to fit database constraint (VARCHAR 15)
    let sanitizedContact = contact.replace(/[\s\-\(\)]/g, '');
    if (sanitizedContact.length > 15) {
      sanitizedContact = sanitizedContact.substring(0, 15);
    }

    // Create staff without transaction (neon serverless doesn't support transactions)
    // 1. Create user first - let database handle auto-increment
    const userResult = await sql`
      INSERT INTO "User" (name, nic, contact_number, address, username, password_hash, user_type, email)
      VALUES (${name}, ${nic}, ${sanitizedContact}, ${address}, ${username}, ${passwordHash}, ${role}, ${email || null})
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
