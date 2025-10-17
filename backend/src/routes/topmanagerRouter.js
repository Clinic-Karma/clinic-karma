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

const router = Router();

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);
router.delete('/:id/hard', hardDelete);

// Dashboard data endpoints (read-only)
router.get('/dashboard/revenue', fetchRevenue);
router.get('/dashboard/pending-payments', fetchPendingPayments);
router.get('/dashboard/bills', fetchBills);
router.get('/dashboard/appointments', fetchAppointments);
router.get('/dashboard/insurance-summary', fetchInsuranceSummary);

export default router;
