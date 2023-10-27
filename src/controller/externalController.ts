import { Client, logger, Task, Variables } from 'camunda-external-task-client-js';
import fs from "fs"

const config = {
  baseUrl: 'http://localhost:8080/engine-rest', 
  use: logger,
};

const client = new Client(config);

client.subscribe("invoiceCreator", async function ({ task, taskService }) {
  // Put your business logic
  const date = new Date();
  
  // Read the content of the file
  const invoiceFilePath = __dirname;
  let invoice = null;
  
  try {
      invoice = fs.readFileSync(invoiceFilePath, 'utf8');
  } catch (error:any) {
      console.error(`Error reading file: ${error.message}`);
      // Handle the error appropriately
      return;
  }
  
  const minute = date.getMinutes();
  const variables = new Variables().setAll({ invoice, date });
  
  // Create separate Variables instances for process and task local scopes
  const processScopeVariables = new Variables();
  const taskLocalVariables = new Variables();

  // check if minute is even
  if (minute % 2 === 0) {
    // for even minutes, store variables in the process scope
    processScopeVariables.setAll({ invoice, date });
    await taskService.complete(task, processScopeVariables, taskLocalVariables);
  } else {
    // for odd minutes, store variables in the task local scope
    taskLocalVariables.setAll({ invoice, date });
    await taskService.complete(task, processScopeVariables, taskLocalVariables);
  }
});

