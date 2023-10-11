// src/app.ts
import express from "express";
import bodyParser from "body-parser";
// import { Client, logger } from "camunda-external-task-client-js";
import userRoutes from "./routes/userRoutes";
import loanApplicationRoutes from "./routes/loanApplicationRoutes";
import { User } from "./entities/User";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import { Request, Response } from "express";
import task from './routes/taskRoutes'
import cors from 'cors';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", userRoutes);
app.use("/api", loanApplicationRoutes);
app.use("/api",task)




app.get("/get-tasks", async (req:Request, res) => {
  try {
    const camundaApiUrl = process.env.CAMUNDA_API_URL || "http://localhost:8080/engine-rest";
    const username = process.env.CAMUNDA_USERNAME || "demo";
    const password = process.env.CAMUNDA_PASSWORD || "demo";

    // Authenticate with Camunda API using Basic Authentication
    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString(
      "base64"
    )}`;

    // Get the processDefinitionKey from the query parameters
    const processDefinitionKey = req.query.processDefinitionKey;

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
});

app.post("/complete-task/:taskId", async (req, res) => {
  try {
    const camundaApiUrl = process.env.CAMUNDA_API_URL || "http://localhost:8080/engine-rest";
    const username = process.env.CAMUNDA_USERNAME || "demo";
    const password = process.env.CAMUNDA_PASSWORD || "demo";

    // Authenticate with Camunda API using Basic Authentication
    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;

    // Get the task ID from the request parameters
    const taskId = req.query.taskId;

    if (!taskId) {
      throw new Error("Task ID is missing or empty in the request parameters.");
    }

    // Define the URL to complete the task
    const completeTaskUrl = `${camundaApiUrl}/task/${taskId}/complete`;

    const data = req.body;
    // Define the request body with variables
    const requestBody = {
      variables: data
    };

    // Make a POST request to complete the task with the request body
    const completeResponse = await axios.post(completeTaskUrl, requestBody, {
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    });

    if (completeResponse.status === 204) {
      console.log(`Task ${taskId} marked as completed successfully`);
      res.status(204).send({message:`Task ${taskId} marked as completed successfully`}); // Send a success response with status code 204
    } else {
      throw new Error(`Failed to complete task. Camunda response: ${completeResponse.status}`);
    }
  } catch (error:any) {
    console.error("Error completing task:", error);
    res.status(500).json({ error: "Failed to complete task" });
  }
});

export default app;
