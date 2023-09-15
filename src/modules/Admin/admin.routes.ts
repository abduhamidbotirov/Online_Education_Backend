import { Router } from 'express';
import AdminController from './admin.contr.js';

const router = Router();
router.get('/', AdminController.getAdmins);
router.post('/', AdminController.createAdmin);


export default router;
