import express from "express";
const router = express.Router();
import usersRoutes from './Users/users.routes.js';
import adminRouter from './Admin/admin.routes.js';

router.use('/test', (req, res) => { res.send("ok") });
router.use('/users', usersRoutes);
router.use('/admins', adminRouter);
export default router