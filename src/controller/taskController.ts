// controllers/taskController.ts
import { Request, Response, response } from 'express';
import axios from 'axios';

import { getCamundaApiUrl, getCamundaCredentials } from '../common';
import fs from 'fs'; 
import path from 'path';




// Task controller
export const getTasksForUser = async (req: Request, res: Response) => {
  try {
    const camundaApiUrl = getCamundaApiUrl();
    const { username, password } = getCamundaCredentials();

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

export const getTaskDetailById = async (req: Request, res: Response) => {
  try {
    // ... (existing code for retrieving task details)
    const camundaApiUrl = getCamundaApiUrl();
    const { username, password } = getCamundaCredentials();

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
        
        // const mergedResponse = { taskDetail, taskVariables };
        const taskDefinitionKey = taskDetail.taskDefinitionKey;
        const updateTaskDetailResponse = await updateTaskDetailByTaskDefinitionKey(res,taskDefinitionKey);
        return res.status(200).json({taskDetail,taskVariables,...updateTaskDetailResponse});
      } 
    }
  } catch (error: any) {
    console.error("Error retrieving task details:", error.message);
    res.status(500).json({ error: "Failed to retrieve task details" });
  }
};

export const updateTaskDetailByTaskDefinitionKey = async (res: Response,taskDefinitionKey:any) => {
  try {
    // const taskDefinitionKey = req.query.taskDefinitionKey as string;
    const fileName = `${taskDefinitionKey}.json`;

    if (!taskDefinitionKey) {
      throw new Error("Task definition key query parameter is missing.");
    }
    
    const jsonDataPath = path.join(__dirname, '..', 'data', fileName);
    const updatedData = JSON.parse(fs.readFileSync(jsonDataPath, 'utf8'));

    return { updatedData }; 
  } catch (error: any) {
    console.error("Error updating task details:", error.message);
    return { error: "Failed to update task details" };
  }
};


export const updateTaskDetail = async (req: Request, res: Response) => {
  try {
    const camundaApiUrl = getCamundaApiUrl();
    const { username, password } = getCamundaCredentials();

    // Retrieve the 'taskDefinitionKey' and 'processInstanceId' from the query parameters
    const taskDefinitionKey = req.query.taskDefinitionKey as string;
    const processInstanceId = req.query.processInstanceId as string;

    if (!taskDefinitionKey || !processInstanceId) {
      throw new Error("Task definition key and/or process instance ID query parameters are missing.");
    }

    // Construct the URL for updating the task details
    const updateTaskUrl = `${camundaApiUrl}/task?processInstanceId=${processInstanceId}&taskDefinitionKey=${taskDefinitionKey}`;

    // Authenticate with Camunda API using Basic Authentication
    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;

    // Make an HTTP GET request to retrieve the task based on taskDefinitionKey and processInstanceId
    const response = await axios.get(updateTaskUrl, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
    });

    if (response.status === 200) {
      const taskList = response.data;

      if (taskList.length === 1) {
        // Extract the taskInstanceId for the single task found
        const taskInstanceId = taskList[0].id;

        // Extract the updated data from the request body
        const updatedData = req.body.updatedData;

        // Construct the URL for updating the task details by appending the taskInstanceId
        const updateTaskDetailUrl = `${camundaApiUrl}/task/${taskInstanceId}`;

        // Make an HTTP PUT request to update the task details
        const updateResponse = await axios.put(updateTaskDetailUrl, updatedData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: authHeader,
          },
        });

        if (updateResponse.status === 204) {
          // The task details were successfully updated
          res.status(204).send(); // No content
        } else {
          res.status(updateResponse.status).json({ error: "Failed to update task details in Camunda." });
        }
      } else {
        res.status(404).json({ error: "No task found matching the provided task definition key and process instance." });
      }
    } else {
      res.status(response.status).json({ error: "Failed to retrieve task from Camunda API." });
    }
  } catch (error: any) {
    console.error("Error updating task details:", error.message);
    res.status(500).json({ error: "Failed to update task details" });
  }
};

export const getTaskDetailByProcessInstance = async (req: Request, res: Response) => {
  try {
    const camundaApiUrl = getCamundaApiUrl();
    const { username, password } = getCamundaCredentials();

    // Retrieve the 'processInstanceId' from the query parameters
    const processInstanceId = req.query.processInstanceId as string;

    if (!processInstanceId) {
      throw new Error("Process instance ID query parameter is missing.");
    }

    // Fetch all tasks for the given process instance
    const taskListUrl = `${camundaApiUrl}/task?processInstanceId=${processInstanceId}`;

    // Authenticate with Camunda API using Basic Authentication
    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;

    // Make an HTTP GET request to retrieve the task list
    const response = await axios.get(taskListUrl, {
      headers: {
        Authorization: authHeader,
      },
    });

    if (response.status === 200) {
      const taskList = response.data;

      if (taskList.length > 0) {
        // You have retrieved all tasks associated with the process instance
        res.status(200).json({ taskList });
      } else {
        res.status(404).json({ error: "No tasks found for the provided process instance." });
      }
    } else {
      res.status(response.status).json({ error: "Failed to retrieve task list from Camunda API." });
    }
  } catch (error: any) {
    console.error("Error retrieving task details:", error.message);
    res.status(500).json({ error: "Failed to retrieve task details" });
  }
};



export const getTaskDataByTaskDefinitionKey = async (req: Request, res: Response) => {
  try {
    // Replace with your actual Camunda API URL and credentials retrieval logic
    const camundaApiUrl = getCamundaApiUrl();
    const { username, password } = getCamundaCredentials();

    // Retrieve the 'taskDefinitionKey' from the query parameters
    const taskDefinitionKey = req.query.taskDefinitionKey as string;

    if (!taskDefinitionKey) {
      throw new Error("Task definition key query parameter is missing.");
    }

    // Construct the URL to fetch task data based on the taskDefinitionKey
    const taskDataUrl = `${camundaApiUrl}/task?taskDefinitionKey=${taskDefinitionKey}`;

    // Authenticate with Camunda API using Basic Authentication
    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;

    // Make an HTTP GET request to retrieve the task data
    const response = await axios.get(taskDataUrl, {
      headers: {
        Authorization: authHeader,
      },
    });

    if (response.status === 200) {
      const taskData = response.data;

      // Return the task data in the response
      res.status(200).json({ taskData });
    } else {
      res.status(response.status).json({ error: "Failed to retrieve task data from Camunda API." });
    }
  } catch (error: any) {
    console.error("Error retrieving task data:", error.message);
    res.status(500).json({ error: "Failed to retrieve task data" });
  }
};




export const completeTaskById = async (req: Request, res: Response) => {
  try {
    // Replace with your actual Camunda API URL and credentials retrieval logic
    const camundaApiUrl = getCamundaApiUrl();
    const { username, password } = getCamundaCredentials();

    // Retrieve the task ID from the query parameters
    const taskInstanceId = req.query.taskInstanceId as string;

    if (!taskInstanceId) {
      throw new Error("Task ID is missing in the request parameters.");
    }

    // Construct the URL to complete the task with specific variables
    const completeTaskUrl = `${camundaApiUrl}/task/${taskInstanceId}/complete`;

    // Authenticate with Camunda API using Basic Authentication
    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;

    // Variables to complete the task with
    const taskCompletionData = {
      variables: {
        aVariable: {
          value: "aStringValue",
        },
        anotherVariable: {
          value: 42,
        },
        aThirdVariable: {
          value: true,
        },
      },
    };

    // Make an HTTP POST request to complete the task with variables
    const response = await axios.post(completeTaskUrl, taskCompletionData, {
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 204) {
      // Task completion was successful
      res.status(200).json({ message: "Task completed successfully." });
    } else {
      res.status(response.status).json({ error: "Failed to complete the task with variables." });
    }
  } catch (error: any) {
    console.error("Error completing task with variables:", error.message);
    res.status(500).json({ error: "Failed to complete the task with variables" });
  }
};


export const listTasksByCandidateGroup = async (req: Request, res: Response) => {
  try {
    const camundaApiUrl = getCamundaApiUrl();
    const { username, password } = getCamundaCredentials();

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
    const camundaApiUrl = getCamundaApiUrl();
    const { username, password } = getCamundaCredentials();

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
        return res.status(204).send({ message: "task claim successfully" });
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
    const camundaApiUrl = getCamundaApiUrl();
    const { username, password } = getCamundaCredentials();

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
    const camundaApiUrl = getCamundaApiUrl();
    const { username, password } = getCamundaCredentials();

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
    const camundaApiUrl = getCamundaApiUrl();
    const { username, password } = getCamundaCredentials();

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
    const camundaApiUrl = getCamundaApiUrl();
    const { username, password } = getCamundaCredentials();

    // Retrieve the task ID and comment data from the request body
    const taskId = req.query.taskId as string;
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
    const camundaApiUrl = getCamundaApiUrl();
    const { username, password } = getCamundaCredentials();

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
    const camundaApiUrl = getCamundaApiUrl();
    const { username, password } = getCamundaCredentials();
    const taskInstanceId = req.query.taskInstanceId; // Assuming you pass the taskInstanceId as a query parameter

    if (!taskInstanceId) {
      return res.status(400).json({ error: 'taskInstanceId is required' });
    }

    // Build the URL and authorization header for the Camunda API
    const apiUrl = `${camundaApiUrl}/history/user-operation?taskInstanceId=${taskInstanceId}`;
    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

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
    console.error('Error retrieving data from Camunda API:', error.message);
    res.status(500).json({ error: 'Failed to retrieve data from Camunda API' });
  }
};


export const getHistoricIdentityLink = async (req: Request, res: Response) => {
  try {
    const camundaApiUrl = getCamundaApiUrl();
    const { username, password } = getCamundaCredentials();

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

export const getIdentityGroup = async (req: Request, res: Response) => {
  try {
    const camundaApiUrl = getCamundaApiUrl();
    const { username, password } = getCamundaCredentials();

    // Retrieve the 'assignee' from the query parameter
    const assignee = req.query.assignee as string;

    if (!assignee) {
      throw new Error("Assignee parameter is missing or empty.");
    }

    // URL for retrieving user groups
    const userGroupsUrl = `${camundaApiUrl}/identity/groups?userId=${assignee}`;

    // Authenticate with Camunda API using Basic Authentication
    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;

    // Make an HTTP GET request to retrieve user groups
    const response = await axios.get(userGroupsUrl, {
      headers: {
        Authorization: authHeader,
      },
    });

    if (response.status === 200) {
      // Handle the response as needed
      res.status(200).json(response.data);
    } else {
      throw new Error(`Failed to retrieve user groups. Camunda response: ${response.status}`);
    }
  } catch (error: any) {
    console.error("Error retrieving user groups:", error.message);
    res.status(500).json({ error: "Failed to retrieve user groups" });
  }
};


export const userLogin = async (req: Request, res: Response) => {
  try {
   // Use the common functionality
    const camundaApiUrl = getCamundaApiUrl();
    // const { username, password } = getCamundaCredentials();

    // Data to be sent in the request body
    const requestData = {
      username: req.body.username,
      password: req.body.password,
    };

    // URL for identity verification
    const identityVerifyUrl = `${camundaApiUrl}/identity/verify`;

    // Make an HTTP POST request to verify the identity
    const response = await axios.post(identityVerifyUrl, requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      // Handle the response as needed
      res.status(200).json(response.data);
    } else {
      throw new Error(`Identity verification failed. Camunda response: ${response.status}`);
    }
  } catch (error: any) {
    console.error("Error verifying identity:", error.message);
    res.status(500).json({ error: "Identity verification failed" });
  }
};


























