import express from 'express';
import {getHistoryTasksProcessInstanceForUser ,  addTaskForm1, bpmnStartProcess, claimTask, completeTaskById, deployBpmnController, getHistoryTasksForUser, getProcessInstanceVariables, getTaskDetailById, getTaskForm, getTaskForm1, getTasks, getTasksForUser, listTasksByCandidateGroup, unclaimTask, getTaskComment, getHistoryOperation, getHistoricIdentityLink, getIdentityGroup, userLogin } from '../controller/taskController';
import { getTaskDetails } from '../controller/taskController';
import { addTaskForm } from '../controller/taskController';
import { createTaskComment } from '../controller/taskController';


const router = express.Router();

router.get('/task/detail', getTaskDetails);
router.post('/add-task-form/:task_key/:task_id', addTaskForm);

router.post('/add-task-form1/:task_key/:task_id',addTaskForm1)
router.get('/task-detail1/:task_key/:task_id', getTaskForm1);
router.get('/task-detail/:task_key/:task_id', getTaskForm);

router.post('/bpmndeploy',deployBpmnController);
router.post('/bpmnstartprocess/:processKey',bpmnStartProcess);
router.get('/gettasks/:processDefinitionKey',getTasks)
router.get('/getvariables/:processInstanceId', getProcessInstanceVariables);

router.get("/tasks",getTasksForUser)
router.get("/task",getTaskDetailById)
router.post("/task/complete",completeTaskById)
router.get('/listTasksByCandidateGroup', listTasksByCandidateGroup);
router.post("/task/claim",claimTask)
router.post("/task/unclaim",unclaimTask)
router.get("/historytask",getHistoryTasksForUser)
router.get("/historytaskprocessinstance",getHistoryTasksProcessInstanceForUser );

router.post("/createtaskcomment",createTaskComment)
router.get("/gettaskcomment",getTaskComment)
router.get("/gethistoryoperation",getHistoryOperation)
router.get("/gethistoryidentitylink",getHistoricIdentityLink)
router.get("/identitygroup",getIdentityGroup)
router.post("/login",userLogin)
export default router;