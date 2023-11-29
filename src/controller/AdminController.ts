import { Request, Response } from 'express';
import axios, { AxiosError } from 'axios';
import { getCamundaApiUrl } from '../common';

// users


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

export const getUsersByAllUsers = async (req: Request, res: Response) => {
  try {
    // Use the common functionality
    const camundaApiUrl = getCamundaApiUrl();

    // Fetch groups from the external endpoint
    const groupsResponse = await axios.get(`${camundaApiUrl}/engine/default/user`);

    if (groupsResponse.status !== 200) {
      throw new Error(`Failed to fetch groups from the external endpoint. Status: ${groupsResponse.status}`);
    }

    // Assuming the response from the groups endpoint is an array of objects with 'id' property
    const groups = groupsResponse.data;

    if (groups.length === 0) {
      throw new Error('No groups found in the external endpoint response.');
    }

    // Fetch users for each group ID along with group information
    const usersPromises = groups.map(async (group:any) => {
      const groupID = group.id;

      // URL for fetching users based on group membership
      const usersUrl = `${camundaApiUrl}/engine/default/group`;
      const usersByGroupUrl = `${usersUrl}?member=${groupID}`;

      // Make an HTTP GET request to fetch users based on group membership
      const usersResponse = await axios.get(usersByGroupUrl);

      if (usersResponse.status === 200) {
        // Return the group ID, group information, and corresponding users
        return { userId: groupID, user: group, groups: usersResponse.data };
      } else {
        // Handle unexpected response status
        throw new Error(`Failed to fetch users for group ${groupID}. Unexpected Camunda response: ${usersResponse.status}`);
      }
    });

    // Wait for all user fetching promises to resolve
    const usersResults = await Promise.all(usersPromises);

    // Return the results (group ID, group information, and corresponding users) in the response
    res.status(200).json(usersResults);
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error('Camunda error response:', axiosError.response?.status, axiosError.response?.data);
    } else {
      console.error('Error fetching users:', error.message);
    }
    res.status(500).json({ error: 'Failed to fetch users. Please try again later.' });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    // Use the common functionality
    const camundaApiUrl = getCamundaApiUrl();

    // Extract data from the request body
    const { id, firstName, lastName, email } = req.body;

    // URL for updating a user's profile
    const updateUserProfileUrl = `${camundaApiUrl}/engine/default/user/${id}/profile`;

    // Data to be sent in the request body for user profile update
    const requestData = {
      id,
      firstName,
      lastName,
      email,
    };

    // Make an HTTP PUT request to update the user's profile
    const response = await axios.put(updateUserProfileUrl, requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 204) {
      // User profile update succeeded, but there's no content to return
      res.status(204).end();
    } else {
      // Handle unexpected response status
      throw new Error(`User profile update failed. Unexpected Camunda response: ${response.status}`);
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error('Camunda error response:', axiosError.response?.status, axiosError.response?.data);
    } else {
      console.error('Error updating user profile:', error.message);
    }
    res.status(500).json({ error: 'User profile update failed. Please check the provided data and try again.' });
  }
};

export const updateUserGroupMembership = async (req: Request, res: Response) => {
  try {
    // Use the common functionality
    const camundaApiUrl = getCamundaApiUrl();

    // Extract data from the request body
    const { userId, groupId } = req.query;

    // URL for updating a user's group membership
    const updateUserGroupMembershipUrl = `${camundaApiUrl}/engine/default/group/${groupId}/members/${userId}`;

    // Make an HTTP PUT request to update the user's group membership
    const response = await axios.put(updateUserGroupMembershipUrl, null, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 204) {
      // User group membership update succeeded, but there's no content to return
      res.status(204).end();
    } else {
      // Handle unexpected response status
      throw new Error(`User group membership update failed. Unexpected Camunda response: ${response.status}`);
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error('Camunda error response:', axiosError.response?.status, axiosError.response?.data);
    } else {
      console.error('Error updating user group membership:', error.message);
    }
    res.status(500).json({ error: 'User group membership update failed. Please check the provided data and try again.' });
  }
};

export const deleteUserFromGroup = async (req: Request, res: Response) => {
  try {
    // Use the common functionality
    const camundaApiUrl = getCamundaApiUrl();

    // Extract data from the request parameters
    const { userId, groupId } = req.query;

    // URL for deleting a user from a group
    const deleteUserFromGroupUrl = `${camundaApiUrl}/engine/default/group/${groupId}/members/${userId}`;

    // Make an HTTP DELETE request to delete the user from the group
    const response = await axios.delete(deleteUserFromGroupUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 204) {
      // User deletion from the group succeeded, but there's no content to return
      res.status(204).end();
    } else {
      // Handle unexpected response status
      throw new Error(`User deletion from the group failed. Unexpected Camunda response: ${response.status}`);
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error('Camunda error response:', axiosError.response?.status, axiosError.response?.data);
    } else {
      console.error('Error deleting user from the group:', error.message);
    }
    res.status(500).json({ error: 'User deletion from the group failed. Please check the provided data and try again.' });
  }
};







// Groups

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

export const getGroups = async (req: Request, res: Response) => {
  try {
    // Use the common functionality
    const camundaApiUrl = getCamundaApiUrl();

    // URL for fetching groups with sorting
    const groupsUrl = `${camundaApiUrl}/engine/default/group`;
    const sortedGroupsUrl = `${groupsUrl}?sortBy=id&sortOrder=asc`;

    // Make an HTTP GET request to fetch groups with sorting
    const response = await axios.get(sortedGroupsUrl);

    if (response.status === 200) {
      // Return the groups data in the response
      res.status(200).json(response.data);
    } else {
      // Handle unexpected response status
      throw new Error(`Failed to fetch groups. Unexpected Camunda response: ${response.status}`);
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error('Camunda error response:', axiosError.response?.status, axiosError.response?.data);
    } else {
      console.error('Error fetching groups:', error.message);
    }
    res.status(500).json({ error: 'Failed to fetch groups. Please try again later.' });
  }
};

// export const getUsersByAllGroups = async (req: Request, res: Response) => {
//   try {
//     // Use the common functionality
//     const camundaApiUrl = getCamundaApiUrl();

//     // Fetch groups from the external endpoint
//     const groupsResponse = await axios.get('http://localhost:3000/api/groups');

//     if (groupsResponse.status !== 200) {
//       throw new Error(`Failed to fetch groups from the external endpoint. Status: ${groupsResponse.status}`);
//     }

//     // Assuming the response from the groups endpoint is an array of objects with 'id' property
//     const groups = groupsResponse.data;

//     if (groups.length === 0) {
//       throw new Error('No groups found in the external endpoint response.');
//     }

//     // Fetch users for each group ID
//     const usersPromises = groups.map(async (group:any) => {
//       const groupID = group.id;

//       // URL for fetching users based on group membership
//       const usersUrl = `${camundaApiUrl}/engine/default/user`;
//       const usersByGroupUrl = `${usersUrl}?memberOfGroup=${groupID}`;

//       // Make an HTTP GET request to fetch users based on group membership
//       const response = await axios.get(usersByGroupUrl);

//       if (response.status === 200) {
//         // Return the users data for this group
//         return { groupId: groupID, users: response.data };
//       } else {
//         // Handle unexpected response status
//         throw new Error(`Failed to fetch users for group ${groupID}. Unexpected Camunda response: ${response.status}`);
//       }
//     });

//     // Wait for all user fetching promises to resolve
//     const usersResults = await Promise.all(usersPromises);

//     // Return the results (group ID and corresponding users) in the response
//     res.status(200).json(usersResults);
//   } catch (error: any) {
//     if (axios.isAxiosError(error)) {
//       const axiosError = error as AxiosError;
//       console.error('Camunda error response:', axiosError.response?.status, axiosError.response?.data);
//     } else {
//       console.error('Error fetching users:', error.message);
//     }
//     res.status(500).json({ error: 'Failed to fetch users. Please try again later.' });
//   }
// };

export const getUsersByAllGroups = async (req: Request, res: Response) => {
  try {
    // Use the common functionality
    const camundaApiUrl = getCamundaApiUrl();

    // Fetch groups from the external endpoint
    const groupsResponse = await axios.get(`${camundaApiUrl}/engine/default/group?sortBy=id&sortOrder=asc`);

    if (groupsResponse.status !== 200) {
      throw new Error(`Failed to fetch groups from the external endpoint. Status: ${groupsResponse.status}`);
    }

    // Assuming the response from the groups endpoint is an array of objects with 'id' property
    const groups = groupsResponse.data;

    if (groups.length === 0) {
      throw new Error('No groups found in the external endpoint response.');
    }

    // Fetch users for each group ID along with group information
    const usersPromises = groups.map(async (group:any) => {
      const groupID = group.id;

      // URL for fetching users based on group membership
      const usersUrl = `${camundaApiUrl}/engine/default/user`;
      const usersByGroupUrl = `${usersUrl}?memberOfGroup=${groupID}`;

      // Make an HTTP GET request to fetch users based on group membership
      const usersResponse = await axios.get(usersByGroupUrl);

      if (usersResponse.status === 200) {
        // Return the group ID, group information, and corresponding users
        return { groupId: groupID, group: group, users: usersResponse.data };
      } else {
        // Handle unexpected response status
        throw new Error(`Failed to fetch users for group ${groupID}. Unexpected Camunda response: ${usersResponse.status}`);
      }
    });

    // Wait for all user fetching promises to resolve
    const usersResults = await Promise.all(usersPromises);

    // Return the results (group ID, group information, and corresponding users) in the response
    res.status(200).json(usersResults);
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error('Camunda error response:', axiosError.response?.status, axiosError.response?.data);
    } else {
      console.error('Error fetching users:', error.message);
    }
    res.status(500).json({ error: 'Failed to fetch users. Please try again later.' });
  }
};

export const updateGroup = async (req: Request, res: Response) => {
  try {
    // Use the common functionality
    const camundaApiUrl = getCamundaApiUrl();

    // Extract data from the request body
    const { id, name, type } = req.body;

    // URL for updating a group
    const updateGroupUrl = `${camundaApiUrl}/engine/default/group/${id}`;

    // Data to be sent in the request body for group update
    const requestData = {
      id,
      name,
      type,
    };

    // Make an HTTP PUT request to update the group
    const response = await axios.put(updateGroupUrl, requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 204) {
      // Group update succeeded, but there's no content to return
      res.status(204).end();
    } else {
      // Handle unexpected response status
      throw new Error(`Group update failed. Unexpected Camunda response: ${response.status}`);
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error('Camunda error response:', axiosError.response?.status, axiosError.response?.data);
    } else {
      console.error('Error updating group:', error.message);
    }
    res.status(500).json({ error: 'Group update failed. Please check the provided data and try again.' });
  }
};



