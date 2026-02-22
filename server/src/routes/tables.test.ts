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

  it("should return table details and types for a valid table name", async () => {
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
        expect.objectContaining({
          name: "id",
          type: "number",
          editable: false,
        }),
        expect.objectContaining({
          name: "first_name",
          type: "string",
          editable: true,
        }),
        expect.objectContaining({
          name: "created_at",
          type: "datetime",
          editable: false,
        }),
        expect.objectContaining({
          name: "date_of_birth",
          type: "date",
          editable: true,
        }),
        expect.objectContaining({
          name: "is_active",
          type: "boolean",
          editable: true,
        }),
      ]),
    );
  });

  it("should mark foreign key columns as non-editable", async () => {
    const res = await request(app).get("/api/tables/orders");
    expect(res.statusCode).toEqual(200);
    expect(res.body.fields).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "customer_id",
          type: "number",
          editable: false,
        }),
        expect.objectContaining({
          name: "id",
          type: "number",
          editable: false,
        }),
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

  it("should save a row and return the updated row", async () => {
    const res = await request(app)
      .put("/api/tables/customers/rows/1")
      .send({ first_name: "UpdatedName" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.first_name).toBe("UpdatedName");

    const getRes = await request(app).get("/api/tables/customers");
    const savedRow = getRes.body.rows.find((r: any) => r.id === 1);
    expect(savedRow.first_name).toBe("UpdatedName");

    await request(app)
      .put("/api/tables/customers/rows/1")
      .send({ first_name: "Alice" });
  });

  it("should return an error when trying to save a row in a non-existent table", async () => {
    const res = await request(app)
      .put("/api/tables/non_existent_table/rows/1")
      .send({ first_name: "UpdatedName" });
    expect(res.statusCode).toEqual(404);
    expect(res.body.error).toBe('Table "non_existent_table" does not exist');
  });

  it("should return an error when trying to save a non-existent row", async () => {
    const res = await request(app)
      .put("/api/tables/customers/rows/9999")
      .send({ first_name: "UpdatedName" });
    expect(res.statusCode).toEqual(404);
    expect(res.body.error).toBe(
      'Row with id "9999" not found in table "customers"',
    );
  });

  it("should return an error if the save row query fails", async () => {
    await request(app).get("/api/tables");
    const originalQuery = pool.query;
    pool.query = vi.fn().mockRejectedValue(new Error("Query failed"));
    const res = await request(app)
      .put("/api/tables/customers/rows/1")
      .send({ first_name: "UpdatedName" });
    expect(res.statusCode).toEqual(500);
    expect(res.body.error).toBe(
      'Failed to save row with id "1" in table "customers"',
    );
    pool.query = originalQuery;
  });

  it("should return an error if the request body is empty when saving a row", async () => {
    const res = await request(app).put("/api/tables/customers/rows/1");
    expect(res.statusCode).toEqual(400);
  });

  it("should return an error if the row ID is not a number when saving a row", async () => {
    const res = await request(app)
      .put("/api/tables/customers/rows/not_a_number")
      .send({ first_name: "UpdatedName" });
    expect(res.statusCode).toEqual(400);
  });
});
