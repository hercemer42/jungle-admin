import express from "express";
import tablesRouter from "./routes/tables.ts";

const app = express();
app.use(express.json());
app.use("/api/tables", tablesRouter);

export default app;
