import { Request, Response } from 'express';
import axios, { AxiosError } from 'axios';
import { getCamundaApiUrl } from '../common';

export const createUsers = async (req: Request, res: Response) => {
  try {
    // Use the common functionality
    const camundaApiUrl = getCamundaApiUrl();
    
    // Extract data from the request body
    const { id, firstName, lastName, email, password } = req.body;

    // Data to be sent in the request body for user creation
    const requestData = {
      profile: {
        id,
        firstName,
        lastName,
        email,
      },
      credentials: {
        password,
      },
    };

    // URL for user creation
    const userCreateUrl = `${camundaApiUrl}/engine/default/user/create`;
    const authHeader = `Basic ${Buffer.from(`${id}:${password}`).toString('base64')}`;

    // Make an HTTP POST request to create the user
    const response = await axios.post(userCreateUrl, requestData, {
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 204) {
      // User creation succeeded, but there's no content to return
      res.status(204).end();
    } else {
      // Handle unexpected response status
      throw new Error(`User creation failed. Unexpected Camunda response: ${response.status}`);
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error('Camunda error response:', axiosError.response?.status, axiosError.response?.data);
    } else {
      console.error('Error creating user:', error.message);
    }
    res.status(500).json({ error: 'User creation failed. Please check the provided data and try again.' });
  }
};

export const createGroup = async (req: Request, res: Response) => {
  try {
    // Use the common functionality
    const camundaApiUrl = getCamundaApiUrl();
    
    // Extract data from the request body
    const { id, name, type } = req.body;

    // Data to be sent in the request body for group creation
    const requestData = {
      id,
      name,
      type,
    };

    // URL for group creation
    const groupCreateUrl = `${camundaApiUrl}/engine/default/group/create`;
    // Assuming you need some authentication for group creation
    // Provide the necessary authentication details (if any)
    // const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

    // Make an HTTP POST request to create the group
    const response = await axios.post(groupCreateUrl, requestData, {
      headers: {
        // Include your authentication header here if needed
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 204) {
      // Group creation succeeded, but there's no content to return
      res.status(204).end();
    } else {
      // Handle unexpected response status
      throw new Error(`Group creation failed. Unexpected Camunda response: ${response.status}`);
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error('Camunda error response:', axiosError.response?.status, axiosError.response?.data);
    } else {
      console.error('Error creating group:', error.message);
    }
    res.status(500).json({ error: 'Group creation failed. Please check the provided data and try again.' });
  }
};
