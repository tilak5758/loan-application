import axios from "axios";
import { getCamundaApiUrl, getCamundaCredentials } from "../common";
import { Request, Response } from 'express';




export const getFilter = async (req: Request, res: Response) => {
    try {
        // Define the URL to retrieve filter data
        const camundaApiUrl = getCamundaApiUrl();
        const { username, password } = getCamundaCredentials();

        // Retrieve the filter name from the query parameter
        const filterName: string | undefined = req.query.filterName as string | undefined;

        if (!filterName) {
            return res.status(400).json({ error: "Filter name is missing in the query parameters" });
        }

        // URL for retrieving filter data with the given filter name
        const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
        const filterUrl = `${camundaApiUrl}/filter?name=${encodeURIComponent(filterName)}`;

        // Make an HTTP GET request to retrieve filter data
        const response = await axios.get(filterUrl, {
            headers: {
                Authorization: authHeader,
                Accept: "application/json", // Set the Accept header
            },
        });

        if (response.status === 200) {
            // Handle the response as needed
            const responseData = {
                filterName,
                filterData: response.data,
            };
            return res.status(200).json(responseData);
        } else {
            throw new Error(`Failed to retrieve filter data. Camunda response: ${response.status}`);
        }
    } catch (error: any) {
        console.error("Error retrieving filter data:", error.message);
        res.status(500).json({ error: "Failed to retrieve filter data" });
    }
};

export const getTaskAscName = async (req: Request, res: Response) => {
    try {
        const camundaApiUrl = getCamundaApiUrl();
        const { username, password } = getCamundaCredentials();

        // Authenticate with Camunda API using Basic Authentication
        const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

        // Build the URL with sortBy and sortOrder parameters
        const tasksUrl = `${camundaApiUrl}/engine/default/task`;
        const sortBy = 'name'; // Default to 'name' if not provided
        const sortOrder = 'asc'; // Default to 'asc' if not provided
        const apiUrlWithParams = `${tasksUrl}?sortBy=${sortBy}&sortOrder=${sortOrder}`;

        // Make an HTTP GET request to retrieve tasks with the modified URL
        const response = await axios.get(apiUrlWithParams, {
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
        console.error('Error retrieving tasks:', error.message);
        res.status(500).json({ error: 'Failed to retrieve tasks' });
    }
};

export const getTaskDescName = async (req: Request, res: Response) => {
    try {
        const camundaApiUrl = getCamundaApiUrl();
        const { username, password } = getCamundaCredentials();

        // Authenticate with Camunda API using Basic Authentication
        const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

        // Build the URL with sortBy and sortOrder parameters
        const tasksUrl = `${camundaApiUrl}/engine/default/task`;

        const sortBy =   'name'; // Default to 'name' if not provided
        const sortOrder =  'desc'; // Default to 'asc' if not provided

        const apiUrlWithParams = `${tasksUrl}?sortBy=${sortBy}&sortOrder=${sortOrder}`;

        // Make an HTTP GET request to retrieve tasks with the modified URL
        const response = await axios.get(apiUrlWithParams, {
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
        console.error('Error retrieving tasks:', error.message);
        res.status(500).json({ error: 'Failed to retrieve tasks' });
    }
};


export const getTaskAscTime = async (req: Request, res: Response) => {
    try {
        const camundaApiUrl = getCamundaApiUrl();
        const { username, password } = getCamundaCredentials();

        // Authenticate with Camunda API using Basic Authentication
        const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

        // Build the URL with sortBy and sortOrder parameters
        const tasksUrl = `${camundaApiUrl}/engine/default/task`;

        const sortBy = 'created'; // Default to 'name' if not provided
        const sortOrder =  'asc'; // Default to 'asc' if not provided

        const apiUrlWithParams = `${tasksUrl}?sortBy=${sortBy}&sortOrder=${sortOrder}`;

        // Make an HTTP GET request to retrieve tasks with the modified URL
        const response = await axios.get(apiUrlWithParams, {
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
        console.error('Error retrieving tasks:', error.message);
        res.status(500).json({ error: 'Failed to retrieve tasks' });
    }
};

export const getTaskDescTime = async (req: Request, res: Response) => {
    try {
        const camundaApiUrl = getCamundaApiUrl();
        const { username, password } = getCamundaCredentials();

        // Authenticate with Camunda API using Basic Authentication
        const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

        // Build the URL with sortBy and sortOrder parameters
        const tasksUrl = `${camundaApiUrl}/engine/default/task`;

        const sortBy = 'created'; // Default to 'name' if not provided
        const sortOrder = 'desc'; // Default to 'asc' if not provided

        const apiUrlWithParams = `${tasksUrl}?sortBy=${sortBy}&sortOrder=${sortOrder}`;

        // Make an HTTP GET request to retrieve tasks with the modified URL
        const response = await axios.get(apiUrlWithParams, {
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
        console.error('Error retrieving tasks:', error.message);
        res.status(500).json({ error: 'Failed to retrieve tasks' });
    }
};



export const getTaskAscDueTime = async (req: Request, res: Response) => {
    try {
        const camundaApiUrl = getCamundaApiUrl();
        const { username, password } = getCamundaCredentials();

        // Authenticate with Camunda API using Basic Authentication
        const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

        // Build the URL with sortBy and sortOrder parameters
        const tasksUrl = `${camundaApiUrl}/engine/default/task`;

        const sortOrder = 'asc';
        const sortBy = 'due'; 

        const apiUrlWithParams = `${tasksUrl}?sortBy=${sortBy}&sortOrder=${sortOrder}`;

        // Make an HTTP GET request to retrieve tasks with the modified URL
        const response = await axios.get(apiUrlWithParams, {
            headers: {
                Authorization: authHeader,
            },
        });

        // Check if the response is successful (status code 2xx)
        if (response.status >= 200 && response.status < 300) {
            res.status(200).json(response.data);
        } else {
            // Log the actual response for better debugging
            console.error('Failed to retrieve tasks. Camunda response:', response.status, response.data);
            res.status(500).json({ error: 'Failed to retrieve tasks' });
        }
    } catch (error:any) {
        // Log the error message for debugging
        if (axios.isAxiosError(error)) {
        // Log the detailed error information provided by Camunda
        console.error('Camunda error response:', error.response?.status, error.response?.data);
    } else {
        // Log the generic error message for other types of errors
        console.error('Error retrieving tasks:', error.message);
    }
    }
};


export const getTaskDescDueTime = async (req: Request, res: Response) => {
    try {
        const camundaApiUrl = getCamundaApiUrl();
        const { username, password } = getCamundaCredentials();

        // Authenticate with Camunda API using Basic Authentication
        const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

        // Build the URL with sortBy and sortOrder parameters
        const tasksUrl = `${camundaApiUrl}/engine/default/task`;

        const sortOrder =  'desc'; 
        const sortBy = 'due'; 

        const apiUrlWithParams = `${tasksUrl}?sortBy=${sortBy}&sortOrder=${sortOrder}`;

        // Make an HTTP GET request to retrieve tasks with the modified URL
        const response = await axios.get(apiUrlWithParams, {
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
        console.error('Error retrieving tasks:', error.message);
        res.status(500).json({ error: 'Failed to retrieve tasks' });
    }
};


export const getTaskAscAssignee = async (req: Request, res: Response) => {
    try {
        const camundaApiUrl = getCamundaApiUrl();
        const { username, password } = getCamundaCredentials();

        // Authenticate with Camunda API using Basic Authentication
        const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

        // Build the URL with sortBy and sortOrder parameters
        const tasksUrl = `${camundaApiUrl}/engine/default/task`;

        const sortOrder =  'asc'; // Default to 'asc' if not provided
        const sortBy = 'assignee'; // Default to 'name' if not provided

        const apiUrlWithParams = `${tasksUrl}?sortBy=${sortBy}&sortOrder=${sortOrder}`;

        // Make an HTTP GET request to retrieve tasks with the modified URL
        const response = await axios.get(apiUrlWithParams, {
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
        console.error('Error retrieving tasks:', error.message);
        res.status(500).json({ error: 'Failed to retrieve tasks' });
    }
};

export const getTaskDescAssignee = async (req: Request, res: Response) => {
    try {
        const camundaApiUrl = getCamundaApiUrl();
        const { username, password } = getCamundaCredentials();

        // Authenticate with Camunda API using Basic Authentication
        const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

        // Build the URL with sortBy and sortOrder parameters
        const tasksUrl = `${camundaApiUrl}/engine/default/task`;

        const sortOrder =  'desc'; // Default to 'asc' if not provided
        const sortBy = 'assignee'; // Default to 'name' if not provided

        const apiUrlWithParams = `${tasksUrl}?sortBy=${sortBy}&sortOrder=${sortOrder}`;

        // Make an HTTP GET request to retrieve tasks with the modified URL
        const response = await axios.get(apiUrlWithParams, {
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
        console.error('Error retrieving tasks:', error.message);
        res.status(500).json({ error: 'Failed to retrieve tasks' });
    }
};