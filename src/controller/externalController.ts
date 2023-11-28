// import { Request, Response } from 'express';
// import { getCamundaApiUrl, getCamundaCredentials } from "../common";
// import { MongoClient,MongoClientOptions } from 'mongodb';
// import axios from 'axios';

// export const getTaskCount = async (req: Request, res: Response) => {
//   let client: MongoClient | undefined = undefined; 
//   try {
    
//     // Connect to MongoDB
//     const client = new MongoClient('mongodb://localhost:27017', { useNewUrlParser : true, useUnifiedTopology: true } as MongoClientOptions);
//     await client.connect();

//     // Replace with your actual database and collection names
//     const dbName = 'your_database_name';
//     const collectionName = 'tasks';

//     // Construct the URL to get the task count
//     const taskCountUrl = `${getCamundaApiUrl()}/engine/default/task/count`;

//     // Authenticate with Camunda API using Basic Authentication
//     const { username, password } = getCamundaCredentials();
//     const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;

//     // Make an HTTP GET request to get the task count
//     const response = await axios.get(taskCountUrl, {
//       headers: {
//         Authorization: authHeader,
//         'Content-Type': 'application/json',
//       },
//     });

//     if (response.status === 200) {
//       const taskCount = response.data;

//       // Store the task count in MongoDB
//       const db = client.db(dbName);
//       const collection = db.collection(collectionName);

//       // Assuming you have a document structure like { taskCount: 5 }
//       await collection.insertOne({ taskCount });

//       res.status(200).json({ taskCount });
//     } else {
//       res.status(response.status).json({ error: "Failed to get task count." });
//     }
//   } catch (error: any) {
//     console.error("Error getting task count:", error.message);
//     res.status(500).json({ error: "Failed to get task count." });
//   } finally {
//     // Close the MongoDB connection
//     if (client) {
//       await client.close();
//     }
//   }
// };
