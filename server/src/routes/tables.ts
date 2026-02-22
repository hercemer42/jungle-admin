import { Router } from "express";
import { getTableNames, getTableData, saveRow } from "../queries/tables.ts";

const tablesRouter = Router();

tablesRouter.get("/", async (req, res) =>
  getTableNames()
    .then((tableNames) => res.json({ tableNames }))
    .catch((err) => {
      console.error(err);
      res.status(err.status || 500).json({ error: err.message });
    }),
);

tablesRouter.get("/:name", async (req, res) => {
  getTableData(req.params.name)
    .then((data) => res.json(data))
    .catch((err) => {
      console.error(err);
      res.status(err.status || 500).json({ error: err.message });
    });
});

tablesRouter.put("/:name/rows/:id", async (req, res) => {
  const { name, id } = req.params;
  const updatedRow = req.body;

  if (!updatedRow || typeof updatedRow !== "object" || Object.keys(updatedRow).length === 0) {
    res.status(400).json({ error: "Request body is required" });
    return;
  }

  if (isNaN(Number(id))) {
    res.status(400).json({ error: "Row ID must be a number" });
    return;
  }

  saveRow(name, id, updatedRow)
    .then((savedRow) => res.json(savedRow))
    .catch((err) => {
      console.error(err);
      res.status(err.status || 500).json({ error: err.message });
    });
});

export default tablesRouter;
