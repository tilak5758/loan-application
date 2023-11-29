import express from 'express';
import { createGroup, createUsers } from '../controller/AdminController';
const router = express.Router();


router.post('/user/create',createUsers);
router.post('/group/create',createGroup);


export default router;
