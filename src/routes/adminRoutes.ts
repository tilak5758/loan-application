import express from 'express';
import { createGroup, createUsers, deleteUserController, deleteUserFromGroup, getGroups, getUsersByAllGroups, getUsersByAllUsers, updateGroup, updateUserGroupMembership, updateUserProfile } from '../controller/AdminController';
const router = express.Router();


router.post('/user/create',createUsers);
router.get('/user/alluser',getUsersByAllUsers)
router.put('/user/:id/profile',updateUserProfile);
router.put('/groupupdatebyadmin',updateUserGroupMembership)
router.delete('/groupremovebyadmin',deleteUserFromGroup)
router.delete('/deleteuser',deleteUserController)

router.post('/group/create',createGroup);
router.get('/groups',getGroups)
router.get('/groups/alluser',getUsersByAllGroups)
router.put("/groups/:id",updateGroup)

export default router;
