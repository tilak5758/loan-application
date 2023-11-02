import express from 'express';
import { getFilter } from '../controller/filterController';
const router = express.Router();

router.get('/filter',getFilter)



export default router;