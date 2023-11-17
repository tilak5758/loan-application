// src/app.ts
import express from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes";
import loanApplicationRoutes from "./routes/loanApplicationRoutes";
import task from './routes/taskRoutes'
import filter from "./routes/filterRoutes"
import count from './routes/taskCountRoutes'
import cors from 'cors';


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", userRoutes);
app.use("/api", loanApplicationRoutes);
app.use("/api",task)
app.use("/api",filter)
app.use('/api',count)



export default app;
