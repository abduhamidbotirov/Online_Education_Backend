import { Request, Response } from 'express';
import User from './users.schema.js';

class UserController {
  static async getUsers(req: Request, res: Response) {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async createUser(req: Request, res: Response) {
    try {
      const { fullname, email, password } = req.body;
      const user = new User({ fullname, email, password });
      await user.save();
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
}

export default UserController;
