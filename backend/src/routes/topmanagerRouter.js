// backend/src/routes/topmanagerRouter.js
import { Router } from 'express';
import {
  getAll,
  getById,
  create,
  update,
  remove,
  hardDelete,
  fetchRevenue,
  fetchPendingPayments,
  fetchBills,
  fetchAppointments,
  fetchInsuranceSummary,
} from '../controllers/topmanagerController.js';
import { requireAuth, requireRole } from '../middlewares/authMiddleware.js';

const router = Router();

// CRUD operations - require authentication and top-manager role
router.get('/', requireAuth, requireRole('top-manager'), getAll);
router.get('/:id', requireAuth, requireRole('top-manager'), getById);
router.post('/', requireAuth, requireRole('top-manager'), create);
router.put('/:id', requireAuth, requireRole('top-manager'), update);
router.delete('/:id', requireAuth, requireRole('top-manager'), remove);
router.delete('/:id/hard', requireAuth, requireRole('top-manager'), hardDelete);

// Dashboard data endpoints (read-only) - require authentication and top-manager role
router.get('/dashboard/revenue', requireAuth, requireRole('top-manager'), fetchRevenue);
router.get('/dashboard/pending-payments', requireAuth, requireRole('top-manager'), fetchPendingPayments);
router.get('/dashboard/bills', requireAuth, requireRole('top-manager'), fetchBills);
router.get('/dashboard/appointments', requireAuth, requireRole('top-manager'), fetchAppointments);
router.get('/dashboard/insurance-summary', requireAuth, requireRole('top-manager'), fetchInsuranceSummary);

export default router;
