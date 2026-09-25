import { Router } from 'express';
import { createCity, deleteCity, getCity, listCities, updateCity } from '../controllers/city.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', listCities);
router.get('/:id', getCity);

router.use(authenticate);
router.use(authorize('Admin'));

router.post('/', createCity);
router.put('/:id', updateCity);
router.delete('/:id', deleteCity);

export default router;
