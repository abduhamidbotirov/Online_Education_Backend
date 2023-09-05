import express from "express";
const router = express.Router();
router.use('/test', (req,res) => { res.send("ok")});
export default router