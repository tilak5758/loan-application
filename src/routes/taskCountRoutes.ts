import express from 'express';
import { getAssignTaskCount, getDeploymentCount, getLatestDecisionDefinitionCount, getLatestIncidentCount, getLatestProcessDefinitionCount, getTaskCount, getTaskCountWithCandidateGroups, getTaskCountWithoutCandidateGroups, getUnassignedTaskCount, getUnfinishedProcessInstanceCount } from '../controller/countController';

const router = express.Router();


router.get('/taskcount',getTaskCount);
router.get('/taskcount/assginuser',getAssignTaskCount);
router.get('/taskcount/uassiginuser',getUnassignedTaskCount)
router.get('/taskcount/withcandidategroups',getTaskCountWithCandidateGroups)
router.get('/taskcount/withoutcandidategroups',getTaskCountWithoutCandidateGroups)

router.get('/count/unfinishedprocessinstance',getUnfinishedProcessInstanceCount);
router.get('/count/latestprocessdefinition',getLatestProcessDefinitionCount)
router.get('/count/deployments',getDeploymentCount);

router.get('/count/latestdecisiondefinition',getLatestDecisionDefinitionCount);
router.get('/count/latestincident',getLatestIncidentCount)


export default router;