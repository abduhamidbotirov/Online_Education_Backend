import { Router } from 'express';
import UserController from './users.contr.js';

const router = Router();

router.get('/',UserController.getUsers);
router.post('/', UserController.createUser);


export default router;
