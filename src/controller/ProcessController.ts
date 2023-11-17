import { Request, Response } from 'express';
import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';
import { getCamundaApiUrl, getCamundaCredentials } from '../common';


export const deployBpmnController = async (req: Request, res: Response): Promise<void> => {
    try {
        // Camunda credentials
        const camundaApiUrl = getCamundaApiUrl();
        const { username, password } = getCamundaCredentials();

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

export const bpmnStartProcess = async (req: Request, res: Response) => {
    try {
        // Move the code from your existing route handler here

        const camundaApiUrl = getCamundaApiUrl();
        const { username, password } = getCamundaCredentials();
        const processKey = req.query.processKey;

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
    } catch (error: any) {
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
    } catch (error: any) {
        console.error("Error retrieving tasks:", error.message);
        res.status(500).json({ error: "Failed to retrieve tasks" });
    }
};

export const getProcessInstanceDetails = async (req: Request, res: Response) => {
    try {
        const camundaApiUrl = getCamundaApiUrl();
        const { username, password } = getCamundaCredentials();

        const processInstanceId = req.query.processInstanceId ;
        // const tasksUrl = `${camundaApiUrl}/task`

        if (!processInstanceId) {
            throw new Error('Process instance ID is missing or empty.');
        }
        const historicalProcessInstanceUrl = `${camundaApiUrl}/task?processInstanceId=${processInstanceId}`;
        const variablesUrl = `${camundaApiUrl}/process-instance/${processInstanceId}/variables`;


        const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

        const variablesResponse = await axios.get(variablesUrl, {
            headers: {
                Authorization: authHeader,
                'Content-Type': 'application/json',
            },
        });

        const historicalResponse = await axios.get(historicalProcessInstanceUrl, {
            headers: {
                Authorization: authHeader,
            },
        });

        if (variablesResponse.status === 200 && historicalResponse.status === 200) {
            const variables = variablesResponse.data;
            const taskDetails = historicalResponse.data;

            return res.status(200).json({
                message: 'Process instance details retrieved successfully',
                taskDetails: taskDetails,
                variables: variables,
            });
        } else {
            throw new Error('Failed to retrieve process instance details');
        }
    } catch (error: any) {
        console.error('Error retrieving process instance details:', error.message);
        res.status(500).json({ error: 'Failed to retrieve process instance details' });
    }
};

export const getTasksProcessInstanceForUser = async (req: Request, res: Response) => {
    try {
        const camundaApiUrl = getCamundaApiUrl();
        const { username, password } = getCamundaCredentials();

        // Retrieve the 'assignee' from the request query parameters
        const processInstanceId = req.query.processInstanceId as string;

        // Define the historical process instance URL
        const historicalProcessInstanceUrl = `${camundaApiUrl}/task?processInstanceId=${processInstanceId}`;

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


