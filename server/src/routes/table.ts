import { Router } from "express";
import { getTableData } from "../queries/tables.ts";

const tableRouter = Router();

tableRouter.get("/:name", async (req, res) => {
  getTableData(req.params.name)
    .then((data) => res.json(data))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.message });
    });
});

export default tableRouter;
