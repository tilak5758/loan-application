import express from 'express';
import {  addTaskForm1, getTaskForm, getTaskForm1 } from '../controller/taskController';
import { getTaskDetails } from '../controller/taskController';
import { addTaskForm } from '../controller/taskController';

const router = express.Router();

router.get('/task/detail', getTaskDetails);
router.post('/add-task-form/:task_key/:task_id', addTaskForm);
router.post('/add-task-form1/:task_key/:task_id',addTaskForm1)
router.get('/task-detail1/:task_key/:task_id', getTaskForm1);
// router.get('/task-detail/:task_key/:task_id', getTaskForm);

export default router;