import { Router } from 'express';
import {
  getAll,
  getById,
  create,
  update,
  remove,
  hardDelete,
  // New endpoints for doctor and staff management
  test,
  getDoctors,
  createDoctor,
  getStaff,
  getStaffSimple,
  createStaff,
  getSpecializations,
} from '../controllers/branchmanagerController.js';
import { requireAuth, requireRole } from '../middlewares/authMiddleware.js';

const router = Router();

// Original branch manager CRUD routes - require authentication and branch-manager role
router.get('/', requireAuth, requireRole('branch-manager'), getAll);
router.get('/:id', requireAuth, requireRole('branch-manager'), getById);
router.post('/', requireAuth, requireRole('branch-manager'), create);
router.put('/:id', requireAuth, requireRole('branch-manager'), update);
router.delete('/:id', requireAuth, requireRole('branch-manager'), remove);
router.delete('/:id/hard', requireAuth, requireRole('branch-manager'), hardDelete);

// Doctor management routes - require authentication and branch-manager role
router.get('/test', requireAuth, requireRole('branch-manager'), test);
router.get('/doctors', requireAuth, requireRole('branch-manager'), getDoctors);
router.post('/doctors', requireAuth, requireRole('branch-manager'), createDoctor);

// Staff management routes - require authentication and branch-manager role
router.get('/staff', requireAuth, requireRole('branch-manager'), getStaffSimple);
router.post('/staff', requireAuth, requireRole('branch-manager'), createStaff);

// Utility routes - require authentication and branch-manager role
router.get('/specializations', requireAuth, requireRole('branch-manager'), getSpecializations);

export default router;
