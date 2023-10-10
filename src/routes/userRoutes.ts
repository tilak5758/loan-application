// src/routes/userRoutes.ts
import express from 'express';
const router = express.Router();
import * as userController from '../controller/userController';

router.post('/users', userController.createUser);
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);


export default router;
