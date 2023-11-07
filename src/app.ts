// src/app.ts
import express from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes";
import loanApplicationRoutes from "./routes/loanApplicationRoutes";
import task from './routes/taskRoutes'
import filter from "./routes/filterRoutes"
import cors from 'cors';
import axios from "axios";
import path from 'path';
import { getCamundaApiUrl, getCamundaCredentials } from "./common";
// import BpmnViewer from 'bpmn-js';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

// Define the directory where your EJS templates are located
app.set('views', path.join(__dirname, 'views'));

app.use("/api", userRoutes);
app.use("/api", loanApplicationRoutes);
app.use("/api",task)
app.use("/api",filter)


import  { Request, Response } from 'express';


app.get('/render-bpmn', async (req: Request, res: Response) => {
  try {
    const camundaApiUrl = getCamundaApiUrl();
    const { username, password } = getCamundaCredentials();
    const taskId = req.query.taskId as string; // Assuming you pass the task ID as a query parameter

    if (!taskId) {
      return res.status(400).json({ error: 'taskId is required' });
    }

    const taskUrl = `${camundaApiUrl}/engine-rest/task/${taskId}`;
    const taskResponse = await axios.get(taskUrl, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
      },
    });

    if (taskResponse.status === 200) {
      const marker = taskResponse.data;
      const processDefinitionUrl = `${camundaApiUrl}/engine-rest/process-definition/${marker.processDefinitionId}/xml`;
      const processDefinitionResponse = await axios.get(processDefinitionUrl, {
        headers: {
          Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
        },
      });

      if (processDefinitionResponse.status === 200) {
        const bpmnXml = processDefinitionResponse.data.bpmn20Xml;
        res.status(200).send(bpmnXml);
      } else {
        return res.status(500).json({ error: `Failed to retrieve process definition XML from Camunda API. Camunda response: ${processDefinitionResponse.status}` });
      }
    } else {
      return res.status(500).json({ error: `Failed to retrieve task information from Camunda API. Camunda response: ${taskResponse.status}` });
    }
  } catch (error: any) {
    console.error('Error in the controller:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});










export default app;
