import express from 'express';
import {  addTaskForm1, bpmnStartProcess, deployBpmnController, getProcessInstanceVariables, getTaskForm, getTaskForm1, getTasks } from '../controller/taskController';
import { getTaskDetails } from '../controller/taskController';
import { addTaskForm } from '../controller/taskController';

const router = express.Router();

router.get('/task/detail', getTaskDetails);
router.post('/add-task-form/:task_key/:task_id', addTaskForm);
router.post('/add-task-form1/:task_key/:task_id',addTaskForm1)
router.get('/task-detail1/:task_key/:task_id', getTaskForm1);
// router.get('/task-detail/:task_key/:task_id', getTaskForm);

router.post('/bpmndeploy',deployBpmnController);
router.post('/bpmnstartprocess/:processKey',bpmnStartProcess);
router.get('/gettasks/:processDefinitionKey',getTasks)
router.get('/getvariables/:processInstanceId', getProcessInstanceVariables);
export default router;