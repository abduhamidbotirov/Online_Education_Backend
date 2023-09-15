import { Request, Response } from 'express';
import Admin from './admin.schema.js';

class AdminController {
  static async getAdmins(req: Request, res: Response) {
    try {
      const admins = await Admin.find();
      res.status(200).json(admins);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async createAdmin(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const admin = new Admin({ username, password });
      await admin.save();
      res.status(201).json(admin);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
}

export default AdminController;
