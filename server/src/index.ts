import express from "express";
import tablesRouter from "./routes/tables.ts";
import tableRouter from "./routes/table.ts";
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/tables", tablesRouter);
app.use("/api/table", tableRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
