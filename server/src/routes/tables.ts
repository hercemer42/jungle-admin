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
  const page = req.query.page ? Number(req.query.page) : 1;
  const sortColumn = req.query.sortColumn
    ? String(req.query.sortColumn)
    : undefined;
  let columnFilters: Record<string, any> | undefined;
  try {
    if (req.query.columnFilters) {
      columnFilters = JSON.parse(String(req.query.columnFilters));
    }
  } catch (err) {
    res.status(400).json({ error: "Invalid column filters JSON" });
    return;
  }
  const sortOrder = req.query.sortOrder === "desc" ? "desc" : "asc";
  getTableData(req.params.name, page, sortColumn, sortOrder, columnFilters)
    .then((data) => res.json(data))
    .catch((err) => {
      console.error(err);
      res.status(err.status || 500).json({ error: err.message });
    });
});

tablesRouter.put("/:name/rows/:id", async (req, res) => {
  const { name, id } = req.params;
  const updatedRow = req.body;

  if (
    !updatedRow ||
    typeof updatedRow !== "object" ||
    Object.keys(updatedRow).length === 0
  ) {
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
