import { Request, Response, response } from 'express';
import { Task } from '../entities/Task';
import taskdata from "../data/taskdata.json";
import formdata from "../data/formdata.json";
import formdata1 from "../data/formdata1.json";

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