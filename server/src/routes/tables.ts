import { Router } from "express";
import { getTableNames } from "../queries/tables.ts";

const tablesRouter = Router();

tablesRouter.get("/", async (req, res) =>
  getTableNames()
    .then((tableNames) => res.json({ tableNames }))
    .catch((err) => {
      console.error(err);
      res.status(err.status).json({ error: err.message });
    }),
);

export default tablesRouter;
