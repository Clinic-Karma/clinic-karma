// backend/src/controllers/branchmanagerController.js
import {
    createBranchManager,
    getBranchManagerById,
    getAllBranchManagers,
    updateBranchManager,
    softDeleteBranchManager,
    deleteBranchManager,
    // New functions for doctor and staff management
    getAllDoctorsForBranchManager,
    createDoctorForBranchManager,
    getAllStaffForBranchManager,
    createStaffForBranchManager,
    getSpecializationsForBranchManager,
  } from '../db_utils/branchmanager.js';
  
  // GET /api/branchmanagers
  export const getAll = async (req, res) => {
    try {
      const { search = '', branch_id, is_active } = req.query;
      const managers = await getAllBranchManagers({
        search,
        branch_id: branch_id ? Number(branch_id) : null,
        is_active: typeof is_active === 'string' ? is_active === 'true' : null,
      });
  
      res.json({ success: true, data: managers });
    } catch (error) {
      console.error('Error fetching branch managers:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };
  
  // GET /api/branchmanagers/:id
  export const getById = async (req, res) => {
    try {
      const manager = await getBranchManagerById(req.params.id);
      if (!manager)
        return res.status(404).json({ success: false, message: 'Branch manager not found' });
      res.json({ success: true, data: manager });
    } catch (error) {
      console.error('Error fetching branch manager:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };
  
  // POST /api/branchmanagers
  export const create = async (req, res) => {
    try {
      const { name, email } = req.body;
      if (!name || !email)
        return res.status(400).json({ success: false, message: 'Name and email are required' });
  
      const manager = await createBranchManager(req.body);
      res.status(201).json({ success: true, data: manager });
    } catch (error) {
      console.error('Error creating branch manager:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };
  
  // PUT /api/branchmanagers/:id
  export const update = async (req, res) => {
    try {
      const manager = await updateBranchManager(req.params.id, req.body);
      if (!manager)
        return res.status(404).json({ success: false, message: 'Branch manager not found' });
      res.json({ success: true, data: manager });
    } catch (error) {
      console.error('Error updating branch manager:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };
  
  // DELETE /api/branchmanagers/:id (soft delete)
  export const remove = async (req, res) => {
    try {
      const manager = await softDeleteBranchManager(req.params.id);
      if (!manager)
        return res.status(404).json({ success: false, message: 'Branch manager not found' });
      res.json({ success: true, message: 'Deactivated successfully', data: manager });
    } catch (error) {
      console.error('Error soft deleting branch manager:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };
  
  // DELETE /api/branchmanagers/:id/hard (hard delete)
  export const hardDelete = async (req, res) => {
    try {
      const ok = await deleteBranchManager(req.params.id);
      if (!ok)
        return res.status(404).json({ success: false, message: 'Branch manager not found' });
      res.json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
      console.error('Error hard deleting branch manager:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };

  // ===== DOCTOR MANAGEMENT ENDPOINTS =====

  // GET /api/branchmanagers/test
  export const test = async (req, res) => {
    try {
      res.json({ success: true, message: 'Branch manager router is working' });
    } catch (error) {
      console.error('Error in test endpoint:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };

  // GET /api/branchmanagers/staff - Simple version for testing
  export const getStaffSimple = async (req, res) => {
    try {
      res.json({ success: true, staff: [] });
    } catch (error) {
      console.error('Error in getStaffSimple:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };

  // GET /api/branchmanagers/doctors
  export const getDoctors = async (req, res) => {
    try {
      console.log('BranchManager getDoctors: Starting...');
      const doctors = await getAllDoctorsForBranchManager();
      console.log('BranchManager getDoctors: Success, found', doctors.length, 'doctors');
      res.json({ success: true, doctors });
    } catch (error) {
      console.error('BranchManager getDoctors: Error:', error);
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  };

  // POST /api/branchmanagers/doctors
  export const createDoctor = async (req, res) => {
    try {
      const { name, specialization, address, username, password, contact, nic, branch } = req.body;
      
      // Validate required fields
      if (!name || !username || !password || !contact || !nic) {
        return res.status(400).json({ 
          success: false, 
          message: 'Name, username, password, contact, and NIC are required' 
        });
      }

      const result = await createDoctorForBranchManager({
        name,
        specialization,
        address,
        username,
        password,
        contact,
        nic,
        branch
      });

      res.status(201).json({ 
        success: true, 
        message: 'Doctor created successfully',
        data: result 
      });
    } catch (error) {
      console.error('Error creating doctor:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };

  // ===== STAFF MANAGEMENT ENDPOINTS =====

  // GET /api/branchmanagers/staff
  export const getStaff = async (req, res) => {
    try {
      const staff = await getAllStaffForBranchManager();
      res.json({ success: true, staff });
    } catch (error) {
      console.error('Error fetching staff:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };

  // POST /api/branchmanagers/staff
  export const createStaff = async (req, res) => {
    try {
      const { name, role, address, username, password, contact, email, nic, branch } = req.body;
      
      // Validate required fields
      if (!name || !role || !username || !password || !contact || !nic) {
        return res.status(400).json({ 
          success: false, 
          message: 'Name, role, username, password, contact, and NIC are required' 
        });
      }

      // Validate email format if provided
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid email format' 
        });
      }

      // Validate role - updated to handle both old and new role values
      const validRoles = ['receptionist', 'lab-assistant', 'lab-coordinator'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Role must be either "receptionist" or "lab-coordinator"' 
        });
      }

      // Map lab-coordinator to lab-assistant for database consistency
      const dbRole = role === 'lab-coordinator' ? 'lab-assistant' : role;

      const result = await createStaffForBranchManager({
        name,
        role: dbRole,
        address,
        username,
        password,
        contact,
        email,
        nic,
        branch
      });

      res.status(201).json({ 
        success: true, 
        message: 'Staff created successfully',
        data: result 
      });
    } catch (error) {
      console.error('Error creating staff:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };

  // ===== UTILITY ENDPOINTS =====

  // GET /api/branchmanagers/specializations
  export const getSpecializations = async (req, res) => {
    try {
      const specializations = await getSpecializationsForBranchManager();
      res.json({ success: true, specializations });
    } catch (error) {
      console.error('Error fetching specializations:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };
  