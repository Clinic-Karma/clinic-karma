// backend/src/controllers/topmanagerController.js
import {
    createTopManager,
    getTopManagerById,
    getAllTopManagers,
    updateTopManager,
    softDeleteTopManager,
    deleteTopManager,
  } from '../db_utils/topmanager.js';
import {
  getRevenueTrends,
  getPendingPayments,
  getAllBillsForTopManager,
  getAllAppointmentsForTopManager,
  getInsuranceClaimsSummary,
} from '../db_utils/topmanager.js';
  
  // GET /api/topmanagers
  export const getAll = async (req, res) => {
    try {
      const { search = '', is_active } = req.query;
      const data = await getAllTopManagers({
        search,
        is_active: typeof is_active === 'string' ? is_active === 'true' : null,
      });
      res.json({ success: true, data });
    } catch (e) {
      console.error('TopManager getAll:', e);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };
  
  // GET /api/topmanagers/:id
  export const getById = async (req, res) => {
    try {
      const item = await getTopManagerById(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Top manager not found' });
      res.json({ success: true, data: item });
    } catch (e) {
      console.error('TopManager getById:', e);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };
  
  // POST /api/topmanagers
  export const create = async (req, res) => {
    try {
      const { name, email } = req.body;
      if (!name || !email)
        return res.status(400).json({ success: false, message: 'Name and email are required' });
  
      const created = await createTopManager(req.body);
      res.status(201).json({ success: true, data: created });
    } catch (e) {
      if (e?.code === '23505') {
        return res.status(409).json({ success: false, message: 'Email already in use' });
      }
      console.error('TopManager create:', e);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };
  
  // PUT /api/topmanagers/:id
  export const update = async (req, res) => {
    try {
      const updated = await updateTopManager(req.params.id, req.body);
      if (!updated) return res.status(404).json({ success: false, message: 'Top manager not found' });
      res.json({ success: true, data: updated });
    } catch (e) {
      console.error('TopManager update:', e);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };
  
  // DELETE /api/topmanagers/:id (soft)
  export const remove = async (req, res) => {
    try {
      const deactivated = await softDeleteTopManager(req.params.id);
      if (!deactivated) return res.status(404).json({ success: false, message: 'Top manager not found' });
      res.json({ success: true, message: 'Deactivated successfully', data: deactivated });
    } catch (e) {
      console.error('TopManager remove:', e);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };
  
  // DELETE /api/topmanagers/:id/hard (hard)
  export const hardDelete = async (req, res) => {
    try {
      const ok = await deleteTopManager(req.params.id);
      if (!ok) return res.status(404).json({ success: false, message: 'Top manager not found' });
      res.json({ success: true, message: 'Deleted successfully' });
    } catch (e) {
      console.error('TopManager hardDelete:', e);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };

// ====== Top Manager Dashboard Controllers ======

export const fetchRevenue = async (req, res) => {
  try {
    const rows = await getRevenueTrends();
    // Map to frontend shape if needed
    return res.json({ success: true, data: rows });
  } catch (e) {
    console.error('TopManager fetchRevenue:', e);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const fetchPendingPayments = async (req, res) => {
  try {
    const rows = await getPendingPayments();
    return res.json({ success: true, data: rows });
  } catch (e) {
    console.error('TopManager fetchPendingPayments:', e);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const fetchBills = async (req, res) => {
  try {
    const rows = await getAllBillsForTopManager();
    return res.json({ success: true, bills: rows });
  } catch (e) {
    console.error('TopManager fetchBills:', e);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const fetchAppointments = async (req, res) => {
  try {
    const rows = await getAllAppointmentsForTopManager();
    return res.json({ success: true, appointments: rows });
  } catch (e) {
    console.error('TopManager fetchAppointments:', e);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const fetchInsuranceSummary = async (req, res) => {
  try {
    const rows = await getInsuranceClaimsSummary();

    // Normalize to include standard statuses with zeroes if missing
    const normalized = {
      Approved: 0,
      Pending: 0,
      Rejected: 0,
    };

    for (const r of rows) {
      const key = (r.status || '').toString();
      if (normalized.hasOwnProperty(key)) {
        normalized[key] = r.count || 0;
      }
    }

    const totalClaims = normalized.Approved + normalized.Pending + normalized.Rejected;

    // Also provide a chart-friendly array in case the client wants it
    const chart = [
      { name: 'Approved', value: normalized.Approved },
      { name: 'Pending', value: normalized.Pending },
      { name: 'Rejected', value: normalized.Rejected },
    ];

    return res.json({ success: true, summary: normalized, totalClaims, chart });
  } catch (e) {
    console.error('TopManager fetchInsuranceSummary:', e);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
  