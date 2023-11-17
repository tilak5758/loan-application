import axios from 'axios';
import { getCamundaApiUrl, getCamundaCredentials } from '../common';
import { Request, Response, response } from 'express';

export const getTaskCount = async (req: Request, res: Response) => {
  try {
    // Replace with your actual Camunda API URL and credentials retrieval logic
    const camundaApiUrl = getCamundaApiUrl();
    const { username, password } = getCamundaCredentials();

    // Construct the URL to get the task count
    const taskCountUrl = `${camundaApiUrl}/engine/default/task/count`;

    // Authenticate with Camunda API using Basic Authentication
    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;

    // Make an HTTP GET request to get the task count
    const response = await axios.get(taskCountUrl, {
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      const taskCount = response.data;
      res.status(200).json({ taskCount });
    } else {
      res.status(response.status).json({ error: "Failed to get task count." });
    }
  } catch (error: any) {
    console.error("Error getting task count:", error.message);
    res.status(500).json({ error: "Failed to get task count." });
  }
};

export const getAssignTaskCount = async (req: Request, res: Response) => {
  try {
    // Replace with your actual Camunda API URL and credentials retrieval logic
    const camundaApiUrl = getCamundaApiUrl();
    const { username, password } = getCamundaCredentials();

    // Construct the URL to get the task count with query parameters
    const taskCountUrl = `${camundaApiUrl}/engine/default/task/count?assigned=true`;

    // Authenticate with Camunda API using Basic Authentication
    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;

    // Make an HTTP GET request to get the task count
    const response = await axios.get(taskCountUrl, {
      headers: {
        Authorization: authHeader,
        'Accept': 'application/json',
      },
    });

    if (response.status === 200) {
      const taskCount = response.data;
      res.status(200).json({ taskCount });
    } else {
      res.status(response.status).json({ error: "Failed to get task count." });
    }
  } catch (error: any) {
    console.error("Error getting task count:", error.message);
    res.status(500).json({ error: "Failed to get task count." });
  }
};


export const getUnassignedTaskCount = async (req: Request, res: Response) => {
  try {
    // Replace with your actual Camunda API URL and credentials retrieval logic
    const camundaApiUrl = getCamundaApiUrl();
    const { username, password } = getCamundaCredentials();

    // Construct the URL to get the unassigned task count with query parameters
    const unassignedTaskCountUrl = `${camundaApiUrl}/engine/default/task/count?unassigned=true&withoutCandidateGroups=true`;

    // Authenticate with Camunda API using Basic Authentication
    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;

    // Make an HTTP GET request to get the unassigned task count
    const response = await axios.get(unassignedTaskCountUrl, {
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      const unassignedTaskCount = response.data;
      res.status(200).json({ unassignedTaskCount });
    } else {
      res.status(response.status).json({ error: "Failed to get unassigned task count." });
    }
  } catch (error: any) {
    console.error("Error getting unassigned task count:", error.message);
    res.status(500).json({ error: "Failed to get unassigned task count." });
  }
};


export const getTaskCountWithCandidateGroups = async (req: Request, res: Response) => {
  try {
    // Replace with your actual Camunda API URL
    const camundaApiUrl = getCamundaApiUrl();
    const { username, password } = getCamundaCredentials();

    // Construct the URL to get the task count with candidate groups and query parameters
    const taskCountUrl = `${camundaApiUrl}/engine/default/task/count?withCandidateGroups=true`;

    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;

    // Make an HTTP GET request to get the task count with candidate groups
    const response = await axios.get(taskCountUrl, {
      headers: {
        Authorization: authHeader,
      },
    });

    if (response.status === 200) {
      const taskCount = response.data;
      res.status(200).json({ taskCount });
    } else {
      res.status(response.status).json({ error: "Failed to get task count with candidate groups." });
    }
  } catch (error: any) {
    console.error("Error getting task count with candidate groups:", error.message);
    res.status(500).json({ error: "Failed to get task count with candidate groups." });
  }
};


export const getTaskCountWithoutCandidateGroups = async (req: Request, res: Response) => {
  try {
    // Replace with your actual Camunda API URL
    const camundaApiUrl = getCamundaApiUrl();
    const { username, password } = getCamundaCredentials();

    // Construct the URL to get the task count without candidate groups and query parameters
    const taskCountUrl = `${camundaApiUrl}/engine/default/task/count?withoutCandidateGroups=true`;
      
    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;


    // Make an HTTP GET request to get the task count without candidate groups
    const response = await axios.get(taskCountUrl, {
      headers: {
        Authorization: authHeader,
      },
    });

    if (response.status === 200) {
      const taskCount = response.data;
      res.status(200).json({ taskCount });
    } else {
      res.status(response.status).json({ error: "Failed to get task count without candidate groups." });
    }
  } catch (error: any) {
    console.error("Error getting task count without candidate groups:", error.message);
    res.status(500).json({ error: "Failed to get task count without candidate groups." });
  }
};

// processinstance count 



export const getUnfinishedProcessInstanceCount = async (req: Request, res: Response) => {
  try {
    // Replace with your actual Camunda API URL
    const camundaApiUrl = getCamundaApiUrl();
    const { username, password } = getCamundaCredentials();

    // Construct the URL to get the unfinished process instance count with query parameters
    const unfinishedProcessInstanceCountUrl = `${camundaApiUrl}/engine/default/history/process-instance/count?unfinished=true`;

    // Replace with the actual Authorization token if needed
    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;

    // Make an HTTP GET request to get the unfinished process instance count
    const response = await axios.get(unfinishedProcessInstanceCountUrl, {
      headers: {
        Authorization: authHeader,
      },
    });

    if (response.status === 200) {
      const unfinishedProcessInstanceCount = response.data;
      res.status(200).json({ unfinishedProcessInstanceCount });
    } else {
      res.status(response.status).json({ error: "Failed to get unfinished process instance count." });
    }
  } catch (error: any) {
    console.error("Error getting unfinished process instance count:", error.message);
    res.status(500).json({ error: "Failed to get unfinished process instance count." });
  }
};

export const getLatestProcessDefinitionCount = async (req: Request, res: Response) => {
  try {
    // Replace with your actual Camunda API URL
    const camundaApiUrl = getCamundaApiUrl();
    const { username, password } = getCamundaCredentials();

    // Construct the URL to get the process definition count with query parameters
    const processDefinitionCountUrl = `${camundaApiUrl}/engine/default/process-definition/count?latestVersion=true`;

    // Replace with the actual Authorization token if needed
    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`; 

    // Make an HTTP GET request to get the process definition count
    const response = await axios.get(processDefinitionCountUrl, {
      headers: {
        Authorization: authHeader,
      },
    });

    if (response.status === 200) {
      const processDefinitionCount = response.data;
      res.status(200).json({ processDefinitionCount });
    } else {
      res.status(response.status).json({ error: "Failed to get process definition count." });
    }
  } catch (error: any) {
    console.error("Error getting process definition count:", error.message);
    res.status(500).json({ error: "Failed to get process definition count." });
  }
};



export const getDeploymentCount = async (req: Request, res: Response) => {
  try {
    // Replace with your actual Camunda API URL
    const camundaApiUrl = getCamundaApiUrl();
    const { username, password } = getCamundaCredentials();

    // Construct the URL to get the process definition count
    const processDefinitionCountUrl = `${camundaApiUrl}/engine/default/process-definition/count`;

    // Replace with the actual Authorization token if needed
    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`; 

    // Make an HTTP GET request to get the process definition count
    const response = await axios.get(processDefinitionCountUrl, {
      headers: {
        Authorization: authHeader,
      },
    });

    if (response.status === 200) {
      const processDefinitionCount = response.data;
      res.status(200).json({ processDefinitionCount });
    } else {
      res.status(response.status).json({ error: "Failed to get process definition count." });
    }
  } catch (error: any) {
    console.error("Error getting process definition count:", error.message);
    res.status(500).json({ error: "Failed to get process definition count." });
  }
};


export const getLatestDecisionDefinitionCount = async (req: Request, res: Response) => {
  try {
    // Replace with your actual Camunda API URL
    const camundaApiUrl = getCamundaApiUrl();
    const { username, password } = getCamundaCredentials();

    // Construct the URL to get the decision definition count with query parameters
    const decisionDefinitionCountUrl = `${camundaApiUrl}/engine/default/decision-definition/count?latestVersion=true`;

    // Replace with the actual Authorization token if needed
    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`; 

    // Make an HTTP GET request to get the decision definition count
    const response = await axios.get(decisionDefinitionCountUrl, {
      headers: {
        Authorization: authHeader,
      },
    });

    if (response.status === 200) {
      const decisionDefinitionCount = response.data;
      res.status(200).json({ decisionDefinitionCount });
    } else {
      res.status(response.status).json({ error: "Failed to get decision definition count." });
    }
  } catch (error: any) {
    console.error("Error getting decision definition count:", error.message);
    res.status(500).json({ error: "Failed to get decision definition count." });
  }
};


export const getLatestIncidentCount = async (req: Request, res: Response) => {
  try {
    // Replace with your actual Camunda API URL
    const camundaApiUrl = getCamundaApiUrl();
    const { username, password } = getCamundaCredentials();

    // Construct the URL to get the incident count with query parameters
    const incidentCountUrl = `${camundaApiUrl}/engine/default/history/incident/count?latestVersion=true`;

    // Replace with the actual Authorization token if needed
    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`; 

    // Make an HTTP GET request to get the incident count
    const response = await axios.get(incidentCountUrl, {
      headers: {
        Authorization: authHeader,
      },
    });

    if (response.status === 200) {
      const incidentCount = response.data;
      res.status(200).json({ incidentCount });
    } else {
      res.status(response.status).json({ error: "Failed to get incident count." });
    }
  } catch (error: any) {
    console.error("Error getting incident count:", error.message);
    res.status(500).json({ error: "Failed to get incident count." });
  }
};

