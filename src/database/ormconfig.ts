import * as dotenv from 'dotenv'; // Import dotenv config function
dotenv.config();
import { User } from '../entities/User';
import { LoanApplication } from '../entities/LoanApplication';
import { ConnectionOptions } from 'typeorm';

// Load environment variables from .env file

// Define the configuration object with type annotations
export const databaseConfig: ConnectionOptions = {
  type: process.env.DB_TYPE as 'mysql' || 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_DATABASE || 'nodejsapp',
  entities: [User,LoanApplication], // Define your entity classes
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging:true
  };

