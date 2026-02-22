import request from "supertest";
import app from "../index.ts";
import { pool } from "../db.ts";
import { describe, it, expect, afterAll, vi, afterEach } from "vitest";
import { clearCache } from "../queries/tables.ts";

afterAll(() => {
  pool.end();
});

afterEach(() => {
  clearCache();
});

describe("GET /api/tables", () => {
  it("should return a list of tables", async () => {
    const res = await request(app).get("/api/tables");
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.tableNames)).toBeTruthy();
    expect(res.body.tableNames.length).toBeGreaterThan(0);
    expect(res.body.tableNames).toContain("categories");
    expect(res.body.tableNames).toContain("customers");
  });

  it("should return an error if the table query fails", async () => {
    const originalQuery = pool.query;
    pool.query = vi.fn().mockRejectedValue(new Error("Query failed"));
    clearCache();
    const res = await request(app).get("/api/tables");
    expect(res.statusCode).toEqual(500);
    expect(res.body.error).toBe("Failed to fetch table names");
    pool.query = originalQuery;
  });

  it("should return cached table names on subsequent requests", async () => {
    const originalQuery = pool.query;
    pool.query = vi.fn().mockResolvedValue({ rows: [{ table_name: "test" }] });
    clearCache();
    await request(app).get("/api/tables");
    const res = await request(app).get("/api/tables");
    expect(res.statusCode).toEqual(200);
    expect(res.body.tableNames).toEqual(["test"]);
    expect(pool.query).toHaveBeenCalledTimes(1);
    pool.query = originalQuery;
  });

  it("should return table details for a valid table name", async () => {
    const res = await request(app).get("/api/tables/customers");
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.rows)).toBeTruthy();
    expect(res.body.rows.length).toBeGreaterThan(0);
    const row = res.body.rows[0];
    expect(row).toHaveProperty("id");
    expect(row).toHaveProperty("first_name");
    expect(row.id).toBeGreaterThan(0);
    expect(row.first_name).toBeTruthy();
    expect(res.body.fields).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "id", type: "number" }),
        expect.objectContaining({ name: "first_name", type: "string" }),
        expect.objectContaining({ name: "created_at", type: "datetime" }),
      ]),
    );
  });

  it("should return an error for an invalid table name", async () => {
    const res = await request(app).get("/api/tables/invalid_table_name");
    expect(res.statusCode).toEqual(404);
    expect(res.body.error).toBe('Table "invalid_table_name" does not exist');
  });

  it("should return an error if the table data query fails", async () => {
    await request(app).get("/api/tables");
    const originalQuery = pool.query;
    pool.query = vi.fn().mockRejectedValue(new Error("Query failed"));
    const res = await request(app).get("/api/tables/categories");
    expect(res.statusCode).toEqual(500);
    expect(res.body.error).toBe('Failed to fetch data for table "categories"');
    pool.query = originalQuery;
  });
});
