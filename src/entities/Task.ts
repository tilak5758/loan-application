export interface Task {
    taskForm: {
      task_id: number;
      purpose: string;
      status: string;
    };
    taskVariables: {
      fullname: string;
      address: string;
      loanAmount: number;
    };
  }
  