// src/controllers/userController.ts
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entities/User';

// Create a new user

export const createUser = async (req: Request, res: Response) => {
  try {
    const userRepository = getRepository(User);
    const newUser = userRepository.create(req.body);
    await userRepository.save(newUser);

    return res.status(201).json({User:newUser, message: "User created successfully"});
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


// Retrieve all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const userRepository = getRepository(User);
    const users = await userRepository.find();
    return res.json(users);
  } catch (error) {
    console.error('Error retrieving users:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// // Retrieve a user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const userRepository = getRepository(User);
    const userId = parseInt(req.params.id);
    const user = await userRepository.findOne({ where: { id: userId }});

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

   return  res.status(200).json(user);
  } catch (error) {
    console.error('Error retrieving user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// // Update a user by ID
export const updateUser = async (req: Request, res: Response) => {
  try {
    const userRepository = getRepository(User);
    const userId = parseInt(req.params.id);
    const updatedUser = req.body;

    const existingUser = await userRepository.findOne({ where: { id: userId } });

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
      return;
    }

    // Update user properties
    userRepository.merge(existingUser, updatedUser);
    const savedUser = await userRepository.save(existingUser);

    return res.json(savedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// // Delete a user by ID
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userRepository = getRepository(User);
    const userId:any = req.params.id;
    const user = await userRepository.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await userRepository.remove(user);

    return res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

