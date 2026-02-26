import type { Request, Response } from "express";
import { Router } from "express";
import { getTableNames, getTableData, saveRow } from "../queries/tables.ts";
import { handleError } from "../utils/errors.ts";

const tablesRouter = Router();
type ColumnFilters = Record<string, string>;

tablesRouter.get("/", async (_req: Request, res: Response) => {
  getTableNames()
    .then((tableNames) => res.json({ tableNames }))
    .catch((err) => handleError(res, err));
});

tablesRouter.get("/:name", async (req: Request<{ name: string }>, res: Response) => {
  const page = req.query.page ? Number(req.query.page) : 1;
  const sortColumn = req.query.sortColumn
    ? String(req.query.sortColumn)
    : undefined;
  const sortDirection = req.query.sortDirection === "desc" ? "desc" : "asc";
  const columnFilters = (req.query.columnFilters || {}) as ColumnFilters;

  getTableData(req.params.name, page, sortColumn, sortDirection, columnFilters)
    .then((data) => res.json(data))
    .catch((err) => handleError(res, err));
});

tablesRouter.put("/:name/rows/", async (req: Request<{ name: string }>, res: Response) => {
  const { name } = req.params;
  const updatedRow = req.body;
  const primaryKeys = Object.entries(req.query.primaryKeys || {}) as [
    string,
    string | number,
  ][];

  if (
    !updatedRow ||
    typeof updatedRow !== "object" ||
    Object.keys(updatedRow).length === 0
  ) {
    return res.status(400).json({ error: "Request body is required" });
  }

  if (primaryKeys.length === 0) {
    return res
      .status(400)
      .json({ error: "At least one primary key is required" });
  }

  saveRow(name, updatedRow, primaryKeys)
    .then((savedRow) => res.json(savedRow))
    .catch((err) => handleError(res, err));
});

export default tablesRouter;
