import { Router } from "express";
import { getClient } from "../db.ts";

const tableRouter = Router();

tableRouter.get("/", async (req, res) => {
  const client = await getClient();
  const entries = await client.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name
  `);
  await client.end();
  res.json(parseTableNames(entries));
});

const parseTableNames = (entries: any) => {
  return {
    tableNames: entries.rows.map((row: any) => {
      return row.table_name;
    }),
  };
};

export default tableRouter;
