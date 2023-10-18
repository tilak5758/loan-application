// controllers/taskController.ts
import { Request, Response, response } from 'express';
import { Task } from '../entities/Task';
import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';
import taskdata from "../data/taskdata.json";
import formdata from "../data/formdata.json";
import formdata1 from "../data/formdata1.json"

const sampleData: Task[] = taskdata;
const taskFormData: Record<string, any> = {};

export const getTaskDetails = (req: Request, res: Response): void => {
  const task_id = parseInt(req.query.task_id as string);
  const purpose = req.query.purpose as string;

  const task = sampleData.filter(
    (t) => t.taskForm.task_id === task_id && t.taskForm.purpose === purpose
  );

  if (task) {
    res.status(201).json(task);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
};


export function addTaskForm(req: Request, res: Response): void {
  const taskKey = req.params.task_key;
  const taskId = req.params.task_id;

  const data = req.body;

  const formData = JSON.parse(JSON.stringify(formdata));

  const taskIdentifier = `${taskKey}-${taskId}`;

  const combinedData = {
    ...data,
    ...formData,
  };

  taskFormData[taskIdentifier] = combinedData;

  res.json({ combinedData,message: 'Form data added successfully' });
}

export function addTaskForm1(req: Request, res: Response): void {
  const taskKey = req.params.task_key;
  const taskId = req.params.task_id;

  const data = req.body;

  const formData = JSON.parse(JSON.stringify(formdata1));

  const taskIdentifier = `${taskKey}-${taskId}`;

  const combinedData = {
    ...data,
    ...formData,
  };

  taskFormData[taskIdentifier] = combinedData;

  res.json({ combinedData,message: 'Form data added successfully' });
}

export function getTaskForm(req: Request, res: Response): void {
  const taskKey = req.params.task_key;
  const taskId = req.params.task_id;
  const taskIdentifier = `${taskKey}-${taskId}`;
   

  if (taskIdentifier in taskFormData) {
    const formData = taskFormData[taskIdentifier];
    res.json({formData}); 
  } else {
    res.status(404).json({ error: 'Form data not found for the task' }); 
  }
}

export function getTaskForm1(req: Request, res: Response): void {
  const taskKey = req.params.task_key;
  const taskId = req.params.task_id;
  const taskIdentifier = `${taskKey}-${taskId}`;
   

  if (taskIdentifier in taskFormData) {
    const formData = taskFormData[taskIdentifier];
    res.json({formData}); 
  } else {
    res.status(404).json({ error: 'Form data not found for the task' }); 
  }
}

// Task process controller
export const deployBpmnController = async (req: Request, res: Response): Promise<void> => {
  try {
    // Camunda credentials
    const camundaApiUrl: string = process.env.CAMUNDA_API_URL || 'http://localhost:8080/engine-rest';
    const username: string = process.env.CAMUNDA_USERNAME || 'demo';
    const password: string = process.env.CAMUNDA_PASSWORD || 'demo';

    // BPMN process file path
    const bpmnFilePath: string = __dirname + '/../process/process_loan.bpmn';

    // Read BPMN file as a buffer
    const bpmnFileData: Buffer = fs.readFileSync(bpmnFilePath);

    const taskVariables = {
      variableName1: 'value1',
      variableName2: 'value2',
      // Add more task variables as needed
    };

    // Authenticate with Camunda API
    const authHeader: string = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

    // Create a FormData object
    const formData = new FormData();

    // Append the BPMN file with the correct filename
    formData.append('data', bpmnFileData, {
      filename: 'process_loan.bpmn',
    });

    // Append other form fields from deploymentConfig (assuming you have them in req.body)
    for (const key in req.body) {
      if (req.body.hasOwnProperty(key)) {
        formData.append(key, req.body[key]);
      }
    }

    // Deploy the BPMN process
    const response = await axios.post(
      `${camundaApiUrl}/deployment/create`,
      formData,
      {
        headers: {
          ...formData.getHeaders(), // Set the correct headers for FormData
          Authorization: authHeader,
        },
      }
    );

    console.log('Deployment ID:', response.data.id);
    // console.log('Deployment Name:', response.data.name);

    res.status(200).json({ message: 'BPMN process deployed successfully' });
  } catch (error) {
    console.error('Error deploying BPMN process:', error);
    res.status(500).json({ error: 'Failed to deploy BPMN process' });
  }
};

export const bpmnStartProcess = async (req: any, res: any) => {
  try {
    // Move the code from your existing route handler here

    const camundaApiUrl =
      process.env.CAMUNDA_API_URL || "http://localhost:8080/engine-rest";
    const username = process.env.CAMUNDA_USERNAME || "demo";
    const password = process.env.CAMUNDA_PASSWORD || "demo";
    const processKey = req.params.processKey;

    if (!processKey) {
      throw new Error("Process key is missing or empty.");
    }

    const startProcessUrl = `${camundaApiUrl}/process-definition/key/${processKey}/start`;

    // Authenticate with Camunda API using Basic Authentication
    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
    
    // Define the variables you want to send with the process start
    const requestBody = {
        "variables": {
          "name": {
            "value": "tilak",
            "type": "String"
          }
        },
      
    };
  
    const response = await axios.post(startProcessUrl, requestBody, {
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      res.status(200).json({
        message: "BPMN process instance started successfully",
        processInstanceId: response.data.id,
      
      });
    } else {
      throw new Error(`Failed to start the process instance. Camunda response: ${response.status}`);
    }
  } catch (error:any) {
    console.error("Error starting the process instance:", error.message);
    res.status(500).json({ error: "Failed to start the process instance" });
  }
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const camundaApiUrl = process.env.CAMUNDA_API_URL || "http://localhost:8080/engine-rest";
    const username = process.env.CAMUNDA_USERNAME || "demo";
    const password = process.env.CAMUNDA_PASSWORD || "demo";

    // Authenticate with Camunda API using Basic Authentication
    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;

    // Get the processDefinitionKey from the query parameters
    const processDefinitionKey = req.query.processDefinitionKey as string;

    if (!processDefinitionKey) {
      throw new Error("Process definition key is missing or empty.");
    }

    // Define the URL to retrieve tasks with the specified process definition key
    const tasksUrl = `${camundaApiUrl}/task?processDefinitionKey=${processDefinitionKey}`;

    // Make a GET request to retrieve tasks
    const response = await axios.get(tasksUrl, {
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      const tasks = response.data;

      // Process the retrieved tasks as needed
      res.status(200).json(tasks);
    } else {
      throw new Error(`Failed to retrieve tasks. Camunda response: ${response.status}`);
    }
  } catch (error:any) {
    console.error("Error retrieving tasks:", error.message);
    res.status(500).json({ error: "Failed to retrieve tasks" });
  }
};

export const getProcessInstanceVariables = async (req: Request, res: Response) => {
  try {
    const camundaApiUrl = process.env.CAMUNDA_API_URL || 'http://localhost:8080/engine-rest';
    const username = process.env.CAMUNDA_USERNAME || 'demo';
    const password = process.env.CAMUNDA_PASSWORD || 'demo';
    const processInstanceId = req.query.processInstanceId as string;

    if (!processInstanceId) {
      throw new Error('Process instance ID is missing or empty.');
    }

    // Endpoint for getting process instance variables
    const variablesUrl = `${camundaApiUrl}/process-instance/${processInstanceId}/variables`;

    // Authenticate with Camunda API using Basic Authentication
    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

    // Make a GET request to retrieve process instance variables
    const response = await axios.get(variablesUrl, {
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      const variables = response.data as Record<string, any>;

      if (typeof variables === 'object') {
        const convertedVariables: Record<string, any> = {};

        for (const variableName in variables) {
          if (variables[variableName].type === 'Json') {
            convertedVariables[variableName] = JSON.parse(variables[variableName].value);
          } else {
            convertedVariables[variableName] = variables[variableName].value;
          }
        }

        return res.status(200).json({
          message: 'Process instance variables retrieved successfully',
          variables: convertedVariables,
        });
      } else {
        throw new Error(`Invalid response format from Camunda API`);
      }
    } else {
      throw new Error(`Failed to retrieve process instance variables. Camunda response: ${response.status}`);
    }
  } catch (error: any) {
    console.error('Error retrieving process instance variables:', error.message);
    res.status(500).json({ error: 'Failed to retrieve process instance variables' });
  }
};




// Task controller
export const getTasksForUser = async (req: Request, res: Response) => {
  try {
    const camundaApiUrl =
      process.env.CAMUNDA_API_URL || "http://localhost:8080/engine-rest";
    const username = process.env.CAMUNDA_USERNAME || "demo";
    const password = process.env.CAMUNDA_PASSWORD || "demo";

    // Retrieve the 'assignee' from the query parameter
    const assignee = req.query.assignee as string;

    if (!assignee) {
      throw new Error("Assignee parameter is missing or empty.");
    }

    const tasksUrl = `${camundaApiUrl}/task?assignee=${assignee}`;

    // Authenticate with Camunda API using Basic Authentication
    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;

    // Make an HTTP GET request to retrieve tasks
    const response = await axios.get(tasksUrl, {
      headers: {
        Authorization: authHeader,
      },
    });

    if (response.status === 200) {
      res.status(200).json(response.data);
    } else {
      throw new Error(`Failed to retrieve tasks. Camunda response: ${response.status}`);
    }
  } catch (error: any) {
    console.error("Error retrieving tasks:", error.message);
    res.status(500).json({ error: "Failed to retrieve tasks" });
  }
};

export const getTaskDetailById = async (req:Request, res:Response) => {
  try {
    const camundaApiUrl =
      process.env.CAMUNDA_API_URL || "http://localhost:8080/engine-rest";
    const username = process.env.CAMUNDA_USERNAME || "demo";
    const password = process.env.CAMUNDA_PASSWORD || "demo";

    // Retrieve the 'taskInstanceId' from the query parameter
    const taskInstanceId = req.query.taskInstanceId as string;

    if (!taskInstanceId) {
      throw new Error("Task instance ID query parameter is missing or empty.");
    }

    const taskDetailUrl = `${camundaApiUrl}/task/${taskInstanceId}`;

    // Authenticate with Camunda API using Basic Authentication
    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;

    // Make an HTTP GET request to retrieve task details
    const taskDetailResponse = await axios.get(taskDetailUrl, {
      headers: {
        Authorization: authHeader,
      },
    });

    if (taskDetailResponse.status === 200) {
      const taskDetail = taskDetailResponse.data;

      // Retrieve task variables for the task instance
      const taskVariablesUrl = `${camundaApiUrl}/task/${taskInstanceId}/variables`;

      const taskVariablesResponse = await axios.get(taskVariablesUrl, {
        headers: {
          Authorization: authHeader,
        },
      });

      if (taskVariablesResponse.status === 200) {
        const taskVariables = taskVariablesResponse.data;
        // Combine task details and task variables and send in the response
        return res.status(200).json({ taskDetail, taskVariables });
      } else {
        throw new Error(`Failed to retrieve task variables. Camunda response: ${taskVariablesResponse.status}`);
      }
    } else {
      throw new Error(`Failed to retrieve task details. Camunda response: ${taskDetailResponse.status}`);
    }
  } catch (error:any) {
    console.error("Error retrieving task details:", error.message);
    res.status(500).json({ error: "Failed to retrieve task details" });
  }
};

export const completeTaskById = async (req:Request, res:Response) => {
  try {
    const camundaApiUrl = process.env.CAMUNDA_API_URL || 'http://localhost:8080/engine-rest';
    const username = process.env.CAMUNDA_USERNAME || 'demo';
    const password = process.env.CAMUNDA_PASSWORD || 'demo';

    const taskInstanceId = req.query.taskInstanceId as string;

    if (!taskInstanceId) {
      return res.status(400).json({ error: 'Task instance ID is missing in the query parameters' });
    }

    // Create the URL to complete the task
    const completeTaskUrl = `${camundaApiUrl}/task/${taskInstanceId}/complete`;

    // Authenticate with Camunda API using Basic Authentication
    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

    // Access the data from the request body
    const requestData = req.body;

    // Make an HTTP POST request to complete the task with the data from the request
    const response = await axios.post(completeTaskUrl, requestData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
    });

    if (response.status === 204) {
      console.log(`Task with ID ${taskInstanceId} completed successfully.`);
      return res.status(200).json({ message: `Task with ID ${taskInstanceId} completed successfully` });
    } else {
      console.error(`Failed to complete task. Camunda response: ${response.status}`);
      return res.status(500).json({ error: 'Failed to complete the task' });
    }
  } catch (error:any) {
    console.error('Error completing the task:', error.message);
    return res.status(500).json({ error: 'Failed to complete the task' });
  }
};

export const listTasksByCandidateGroup = async (req: Request, res: Response) => {
  try {
    const camundaApiUrl = process.env.CAMUNDA_API_URL || 'http://localhost:8080/engine-rest';
    const username = process.env.CAMUNDA_USERNAME || 'demo';
    const password = process.env.CAMUNDA_PASSWORD || 'demo';

    const candidateGroup = req.query.candidateGroup as string;

    if (!candidateGroup) {
      return res.status(400).json({ error: 'Candidate group is missing in the query parameters' });
    }

    const listTasksUrl = `${camundaApiUrl}/task?candidateGroup=${candidateGroup}`;

    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

    const response = await axios.get(listTasksUrl, {
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      // Handle a successful response
      const responseData = response.data;
      console.log(responseData);
      return res.status(200).json({ responseData });
    } else if (response.status === 404) {
      // Handle the case where no tasks were found for the candidate group
      return res.status(200).json({ responseData: [] });
    } else {
      // Handle other status codes as needed
      return res.status(response.status).json({ error: 'Failed to retrieve tasks' });
    }
  } catch (error) {
    console.error('Error listing tasks by candidate group:', error);
    return res.status(500).json({ error: 'Failed to list tasks by candidate group' });
  }
};

export const claimTask = async (req: Request, res: Response) => {
  try {
    const camundaApiUrl = process.env.CAMUNDA_API_URL || 'http://localhost:8080/engine-rest';
    const username = process.env.CAMUNDA_USERNAME || 'demo';
    const password = process.env.CAMUNDA_PASSWORD || 'demo';
    
    const taskId = req.query.taskId;
    const claimTaskUrl = `${camundaApiUrl}/task/${taskId}/claim`;
    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

    // Extract the userId from the request body
    const userId = req.query.userId;

    if (userId) {
      const requestBody = {
        userId: userId,
      };

      const response = await axios.post(claimTaskUrl, requestBody, {
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 204) {
        return res.status(204).send({message:"task claim successfully"});
      } else {
        return res.status(response.status).json({ error: 'Failed to claim the task' });
      }
    } else {
      return res.status(400).json({ error: 'userId is required in the request body' });
    }
  } catch (error) {
    console.error('Error claiming the task:', error);
    return res.status(500).json({ error: 'Failed to claim the task' });
  }
};

export const unclaimTask = async (req: Request, res: Response) => {
  try {
    const camundaApiUrl = process.env.CAMUNDA_API_URL || 'http://localhost:8080/engine-rest';
    const username = process.env.CAMUNDA_USERNAME || 'demo';
    const password = process.env.CAMUNDA_PASSWORD || 'demo';

    const taskId = req.query.taskId;
    const unclaimTaskUrl = `${camundaApiUrl}/task/${taskId}/unclaim`;
    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

    const response = await axios.post(unclaimTaskUrl, null, {
      headers: {
        Authorization: authHeader,
      },
    });

    if (response.status === 204) {
      return res.status(204).send({ message: 'Task unclaimed successfully' });
    } else {
      return res.status(response.status).json({ error: 'Failed to unclaim the task' });
    }
  } catch (error) {
    console.error('Error unclaiming the task:', error);
    return res.status(500).json({ error: 'Failed to unclaim the task' });
  }
};

export const getHistoryTasksForUser = async (req: Request, res: Response) => {
  try {
    const camundaApiUrl =
      process.env.CAMUNDA_API_URL || "http://localhost:8080/engine-rest";
    const username = process.env.CAMUNDA_USERNAME || "demo";
    const password = process.env.CAMUNDA_PASSWORD || "demo";

    // Retrieve the 'userId' from the request body
    const assignee = req.query.assignee as string;
    // const userId = req.query.userId;

    const historicalTasksUrl = `${camundaApiUrl}/history/task?assignee=${assignee}`;

    // Authenticate with Camunda API using Basic Authentication
    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;

    // Make an HTTP GET request to retrieve historical tasks
    const response = await axios.get(historicalTasksUrl, {
      headers: {
        Authorization: authHeader,
      },
      
    });

    if (response.status === 200) {
      res.status(200).json(response.data);
    } else {
      throw new Error(`Failed to retrieve historical tasks. Camunda response: ${response.status}`);
    }
  } catch (error: any) {
    console.error("Error retrieving historical tasks:", error.message);
    res.status(500).json({ error: "Failed to retrieve historical tasks" });
  }
};

export const getHistoryTasksProcessInstanceForUser = async (req: Request, res: Response) => {
  try {
    const camundaApiUrl =
      process.env.CAMUNDA_API_URL || "http://localhost:8080/engine-rest";
    const username = process.env.CAMUNDA_USERNAME || "demo";
    const password = process.env.CAMUNDA_PASSWORD || "demo";

    // Retrieve the 'assignee' from the request query parameters
    const assignee = req.query.assignee as string;

    // Define the historical process instance URL
    const historicalProcessInstanceUrl = `${camundaApiUrl}/history/process-instance?assignee=${assignee}`;

    // Authenticate with Camunda API using Basic Authentication
    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;

    // Make an HTTP GET request to retrieve historical process instances
    const response = await axios.get(historicalProcessInstanceUrl, {
      headers: {
        Authorization: authHeader,
      },
    });

    if (response.status === 200) {
      res.status(200).json(response.data);
    } else {
      throw new Error(`Failed to retrieve historical process instances. Camunda response: ${response.status}`);
    }
  } catch (error: any) {
    console.error("Error retrieving historical process instances:", error.message);
    res.status(500).json({ error: "Failed to retrieve historical process instances" });
  }
};

export const createTaskComment = async (req: Request, res: Response) => {
  try {
    const camundaApiUrl =
      process.env.CAMUNDA_API_URL || "http://localhost:8080/engine-rest";
    const username = process.env.CAMUNDA_USERNAME || "demo";
    const password = process.env.CAMUNDA_PASSWORD || "demo";

    // Retrieve the task ID and comment data from the request body
    const taskId = req.body.taskId as string;
    const comment = req.body.comment as string;

    if (!taskId || !comment) {
      throw new Error("Task ID or comment is missing or empty.");
    }

    const commentUrl = `${camundaApiUrl}/task/${taskId}/comment/create`;

    // Authenticate with Camunda API using Basic Authentication
    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;

    // Data for creating a comment
    const commentData = {
      message: comment,
      processInstanceId: taskId, // You can adjust this as needed
    };

    // Make a POST request to create a comment
    const response = await axios.post(commentUrl, commentData, {
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      res.status(200).json(response.data);
    } else {
      throw new Error(`Failed to create a comment. Camunda response: ${response.status}`);
    }
  } catch (error: any) {
    console.error("Error creating a comment:", error.message);
    res.status(500).json({ error: "Failed to create a comment" });
  }
};

export const getTaskComment = async (req: Request, res: Response) => {
  try {
    const camundaApiUrl = process.env.CAMUNDA_API_URL || "http://localhost:8080/engine-rest";
    const username = process.env.CAMUNDA_USERNAME || "demo";
    const password = process.env.CAMUNDA_PASSWORD || "demo";

    // Retrieve the task ID and comment ID from the query parameters
    const taskId = req.query.taskId as string;
    const commentId = req.query.commentId as string;

    if (!taskId || !commentId) {
      return res.status(400).json({ error: "Task ID or comment ID is missing or empty." });
    }

    const commentUrl = `${camundaApiUrl}/task/${taskId}/comment/${commentId}`;

    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;

    const response = await axios.get(commentUrl, {
      headers: {
        Authorization: authHeader,
        'Accept': 'application/json',
      },
    });

    if (response.status === 200) {
      res.status(200).json(response.data);
    } else {
      return res.status(500).json({ error: `Failed to retrieve the comment. Camunda response: ${response.status}` });
    }
  } catch (error: any) {
    console.error("Error retrieving the comment:", error.message);
    res.status(500).json({ error: "Failed to retrieve the comment" });
  }
};

export const getHistoryOperation = async (req: Request, res: Response) => {
  try {
    const camundaApiUrl = process.env.CAMUNDA_API_URL || "http://localhost:8080/engine-rest";
    const username = process.env.CAMUNDA_USERNAME || "demo";
    const password = process.env.CAMUNDA_PASSWORD || "demo";

    // Build the URL and authorization header for the Camunda API
    const apiUrl = `${camundaApiUrl}/history/user-operation`;
    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;

    // Make an HTTP GET request to the Camunda API with the authorization header
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: authHeader,
      },
    });

    if (response.status === 200) {
      res.status(200).json(response.data);
    } else {
      return res.status(500).json({ error: `Failed to retrieve data from Camunda API. Camunda response: ${response.status}` });
    }
  } catch (error: any) {
    console.error("Error retrieving data from Camunda API:", error.message);
    res.status(500).json({ error: "Failed to retrieve data from Camunda API" });
  }
};

export const getHistoricIdentityLink = async (req: Request, res: Response) => {
  try {
    const camundaApiUrl = process.env.CAMUNDA_API_URL || "http://localhost:8080/engine-rest";
    const username = process.env.CAMUNDA_USERNAME || "demo";
    const password = process.env.CAMUNDA_PASSWORD || "demo";

    // Build the URL for the Camunda API endpoint you want to access
    const apiUrl = `${camundaApiUrl}/history/identity-link-log`;

    // Create the basic authorization header
    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;

    // Make an HTTP GET request to the Camunda API with the authorization header
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: authHeader,
      },
    });

    if (response.status === 200) {
      res.status(200).json(response.data);
    } else {
      return res.status(500).json({ error: `Failed to retrieve data from Camunda API. Camunda response: ${response.status}` });
    }
  } catch (error: any) {
    console.error("Error retrieving data from Camunda API:", error.message);
    res.status(500).json({ error: "Failed to retrieve data from Camunda API" });
  }
};






























