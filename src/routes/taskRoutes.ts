import express from 'express';
import {getHistoryTasksProcessInstanceForUser , claimTask, completeTaskById, getHistoryTasksForUser, getTaskDetailById, getTasksForUser, listTasksByCandidateGroup, unclaimTask, getTaskComment, getHistoryOperation, getHistoricIdentityLink, getIdentityGroup, userLogin, getTaskDetailByProcessInstance, updateTaskDetail, updateTaskDetailByTaskDefinitionKey, getTaskDataByTaskDefinitionKey } from '../controller/taskController';
import { createTaskComment } from '../controller/taskController';
import { bpmnStartProcess, deployBpmnController, getProcessInstanceVariables, getTasks } from '../controller/ProcessController';
import { addTaskForm, addTaskForm1, getTaskDetails, getTaskForm, getTaskForm1 } from '../controller/formController';


const router = express.Router();

// form routes
router.get('/task/detail',getTaskDetails);
router.post('/add-task-form/:task_key/:task_id', addTaskForm);
router.post('/add-task-form1/:task_key/:task_id',addTaskForm1)
router.get('/task-detail1/:task_key/:task_id', getTaskForm);
router.get('/task-detail/:task_key/:task_id', getTaskForm1);

// process routes
router.post('/deploy',deployBpmnController);
router.post('/process/start',bpmnStartProcess);
router.get('/tasks/active',getTasks)
router.get('/process/variables', getProcessInstanceVariables);


// login route
router.post("/login",userLogin)

// task routes
router.get("/tasks",getTasksForUser);
router.get("/taskdetail",getTaskDetailByProcessInstance);
router.get("/update-json",)
// router.put("/updatetaskdetail",updateTaskDetail)
router.get('/update-task', updateTaskDetailByTaskDefinitionKey);
router.get('/gettaskdata',getTaskDataByTaskDefinitionKey)
// router.get("/update-tasks",updateTaskDetailByTaskInstanceId)


router.get("/task",getTaskDetailById)
router.post("/task/complete",completeTaskById)
router.get('/Tasks/candidate-group', listTasksByCandidateGroup);
router.post("/task/claim",claimTask)
router.post("/task/unclaim",unclaimTask)
router.post("/task/comment",createTaskComment)
router.get("/task/comment",getTaskComment)


// history routes
router.get("/history/tasks",getHistoryTasksForUser)
router.get("/history/task/processinstance",getHistoryTasksProcessInstanceForUser );
router.get("/history/operation",getHistoryOperation)
router.get("/history/identity-link",getHistoricIdentityLink)

// identity routes
router.get("/identity/group",getIdentityGroup)

export default router;