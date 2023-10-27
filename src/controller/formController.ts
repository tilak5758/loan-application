import { Request, Response, response } from 'express';
import { Task } from '../entities/Task';
import taskdata from "../data/taskdata.json";
import formdata from "../data/formdata.json";
import formdata1 from "../data/formdata1.json";
import axios from 'axios';
import { getCamundaApiUrl, getCamundaCredentials } from '../common';

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

  res.json({ combinedData, message: 'Form data added successfully' });
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

  res.json({ combinedData, message: 'Form data added successfully' });
}

export function getTaskForm(req: Request, res: Response): void {
  const taskKey = req.params.task_key;
  const taskId = req.params.task_id;
  const taskIdentifier = `${taskKey}-${taskId}`;


  if (taskIdentifier in taskFormData) {
    const formData = taskFormData[taskIdentifier];
    res.json({ formData });
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
    res.json({ formData });
  } else {
    res.status(404).json({ error: 'Form data not found for the task' });
  }
}


export const getTaskRenderedFormById = async (req: Request, res: Response) => {
  try {
    const camundaApiUrl = getCamundaApiUrl(); // Get Camunda API URL
    const { username, password } = getCamundaCredentials(); // Get Camunda credentials

    // Retrieve the 'taskInstanceId' from the query parameter
    const taskInstanceId = req.query.taskInstanceId as string;

    if (!taskInstanceId) {
      throw new Error("Task instance ID query parameter is missing or empty.");
    }

    const renderedFormUrl = `${camundaApiUrl}/task/${taskInstanceId}/rendered-form`;

    // Authenticate with Camunda API using Basic Authentication
    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;

    // Make an HTTP GET request to retrieve the rendered form
    const renderedFormResponse = await axios.get(renderedFormUrl, {
      headers: {
        Authorization: authHeader,
      },
    });

    if (renderedFormResponse.status === 200) {
      const renderedFormHtml = `
        <!DOCTYPE html>
<html>
<head>
<style>
  /* Style for the Fullname text field */
  #Field_0dzplg1 {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 10px;
  }

  /* Style for the Date of birth datetime field */
  #Field_11879it {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 10px;
  }
</style>
</head>
<body>
  <form id="Form_review_loan_request">
    <label for="Field_0dzplg1">Fullname:</label>
    <input type="text" id="Field_0dzplg1" name="fullname" />

    <label for="Field_11879it">Date of birth:</label>
    <input type="datetime" id="Field_11879it" name="dob" />

    <!-- Other form elements go here -->

    <input type="submit" value="Submit">
  </form>
</body>
</html>

      `;

      return res.status(200).send(renderedFormHtml); // Send the HTML form with CSS as the response
    } else {
      throw new Error(`Failed to retrieve rendered form. Camunda response: ${renderedFormResponse.status}`);
    }
  } catch (error: any) {
    console.error("Error retrieving rendered form:", error.message);
    res.status(500).json({ error: "Failed to retrieve rendered form" });
  }
};


