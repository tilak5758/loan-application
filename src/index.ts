import * as dotenv from 'dotenv';
dotenv.config();
import { databaseConfig } from './database/ormconfig';
import app from './app';
import { createConnection, Connection } from 'typeorm';
import fs from 'fs';


const PORT: number | string = process.env.APP_PORT || 3000;

// Database connection
async function connectToDatabase(): Promise<void> {
  try {
    const connection: Connection = await createConnection(databaseConfig);
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

connectToDatabase();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
