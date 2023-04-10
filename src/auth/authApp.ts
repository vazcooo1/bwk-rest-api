import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcrypt';
import { IUser, User } from '../user';
import jwt from 'jsonwebtoken';


const router = express.Router();
const jwtSecret = process.env.JWT_SECRET;

router.post('/register', async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      const userExists = await User.findOne({ username });
  
      if (userExists) {
        return res.status(409).json({ error: 'Username already exists' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const user: IUser = new User({
        username,
        password: hashedPassword,
      });
  
      await user.save();
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  });

  router.post('/login', async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid password' });
      }
  
      // Generate JWT
      const token = jwt.sign({ id: user._id, username: user.username }, jwtSecret as string, {
        expiresIn: '7d', // Token will expire in 7 days
      });
  
      res.status(200).json({ message: 'Logged in successfully', token });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to log in' });
    }
  });

export default router;