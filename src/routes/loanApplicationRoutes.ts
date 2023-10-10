import express from 'express';
const router = express.Router();
import * as loanApplication from '../controller/loanApplication';

router.post('/createloanapplication', loanApplication.createLoanApplication);


export default router;
