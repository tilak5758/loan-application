import { Client, logger, Task, Variables } from 'camunda-external-task-client-js';

const config = {
  baseUrl: 'http://localhost:8080/engine-rest', // Camunda Engine REST API URL
  use: logger,
};

const client = new Client(config);





  client.subscribe("invoiceCreator", async function ({ task, taskService }) {
    // Put your business logic
    // complete the task
    const date = new Date();
    const invoice = await new File({ localPath: "./assets/invoice.txt" }).load();
    const minute = date.getMinutes();
    const variables = new Variables().setAll({ invoice, date });
  
    // check if minute is even
    if (minute % 2 === 0) {
      // for even minutes, store variables in the process scope
      await taskService.complete(task, variables);
    } else {
      // for odd minutes, store variables in the task local scope
      await taskService.complete(task, null, variables);
    }
  });
