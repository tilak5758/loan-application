import express from 'express';
import { getFilter, getTaskAscDueTime, getTaskAscName, getTaskAscTime, getTaskDescName, getTaskDescTime } from '../controller/filterController';
// import { getTasks } from '../controller/ProcessController';
const router = express.Router();

router.get('/filter',getFilter)

router.get('/task/ascname',getTaskAscName)
router.get('/task/descname',getTaskDescName)

router.get('/task/asctime',getTaskAscTime)
router.get('/task/desctime',getTaskDescTime)

router.get('/task/ascduetime',getTaskAscDueTime);
router.get('/task/desctime',getTaskAscDueTime)




export default router;