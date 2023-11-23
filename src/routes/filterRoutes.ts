import express from 'express';
import { getFilter, getTaskAscName, getTaskDescName } from '../controller/filterController';
// import { getTasks } from '../controller/ProcessController';
const router = express.Router();

router.get('/filter',getFilter)

router.get('/task/ascname',getTaskAscName)
router.get('/task/descname',getTaskDescName)




export default router;