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
        return res.status(409).json({ error: 'Nombre de usuario ya existe' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const user: IUser = new User({
        username,
        password: hashedPassword,
      });
  
      await user.save();
      res.status(201).json({ message: 'Usuario creado exitosamente' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Falló la creación de usuario' });
    }
  });

  router.post('/login', async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Contraseña incorrecta' });
      }
  
      // Generate JWT
      const token = jwt.sign({ id: user._id, username: user.username }, jwtSecret as string, {
        expiresIn: '7d', // Token will expire in 7 days
      });
  
      res.status(200).json({ message: 'Acceso exitoso', token });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Falló el acceso' });
    }
  });

export default router;