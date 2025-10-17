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
  createStaff,
  getSpecializations,
} from '../controllers/branchmanagerController.js';

const router = Router();

// Original branch manager CRUD routes
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);
router.delete('/:id/hard', hardDelete);

// Doctor management routes
router.get('/test', test);
router.get('/doctors', getDoctors);
router.post('/doctors', createDoctor);

// Staff management routes
router.get('/staff', getStaff);
router.post('/staff', createStaff);

// Utility routes
router.get('/specializations', getSpecializations);

export default router;
