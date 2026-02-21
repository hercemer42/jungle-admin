import express from "express";
import tableRouter from "./routes/tables.ts";
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/tables", tableRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
