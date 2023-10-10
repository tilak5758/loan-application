import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entities/User';
import { LoanApplication } from '../entities/LoanApplication';



export async function createLoanApplication(req: Request, res: Response) {
    try {
    const loanApplicationRepository = getRepository(LoanApplication);
    const userRepository = getRepository(User);
      const { userId, ...loanApplicationData } = req.body;
  
      // Check if the user exists
      const user = await userRepository.findOne({ where: { id: userId }});
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Create the loan application and associate it with the user
      const newLoanApplication = loanApplicationRepository.create({
        ...loanApplicationData,
        user,
      });
      await loanApplicationRepository.save(newLoanApplication);
  
      return res.status(201).json({newLoanApplication, message:"created loanApplication successfully"});
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Unable to create a loan application' });
    }
  }
