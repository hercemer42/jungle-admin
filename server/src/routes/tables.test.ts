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
});

describe("GET /api/tables/:name", () => {
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
    expect(res.body.primaryKeyColumns).toEqual(["id"]);
  });

  it("should return an error for an invalid table name", async () => {
    const res = await request(app).get("/api/tables/invalid_table_name");
    expect(res.statusCode).toEqual(404);
    expect(res.body.error).toBe('Table "invalid_table_name" does not exist');
  });

  it("should return an error if an sql injection attempt is made in the table name", async () => {
    const res = await request(app).get("/api/tables/;DROP TABLE customers;--");
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toBe("Invalid table name");
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

  it("should return the primary key columns in the response", async () => {
    const res = await request(app).get("/api/tables/orders");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("primaryKeyColumns");
    expect(Array.isArray(res.body.primaryKeyColumns)).toBeTruthy();
    expect(res.body.primaryKeyColumns.length).toBeGreaterThan(0);
  });

  it("should return composite primary key columns in the response", async () => {
    const res = await request(app).get("/api/tables/order_items");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("primaryKeyColumns");
    expect(Array.isArray(res.body.primaryKeyColumns)).toBeTruthy();
    expect(res.body.primaryKeyColumns.length).toBeGreaterThan(1);
  });

  describe("field editability", () => {
    it("should mark primary key columns as non-editable", async () => {
      const res = await request(app).get("/api/tables/customers");
      expect(res.statusCode).toEqual(200);
      expect(res.body.fields).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: "id",
            type: "number",
            editable: false,
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
  });

  describe("pagination", () => {
    it("should return pagination metadata", async () => {
      const res = await request(app).get("/api/tables/orders");
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("pageCount");
      expect(res.body).toHaveProperty("totalCount");
      expect(typeof res.body.pageCount).toBe("number");
      expect(typeof res.body.totalCount).toBe("number");
    });

    it("should return the correct total count of rows for a table", async () => {
      const res = await request(app).get("/api/tables/orders");
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("totalCount");
      expect(typeof res.body.totalCount).toBe("number");
      expect(res.body.totalCount).toBeGreaterThan(0);
    });

    it("should return the correct page count for a table", async () => {
      const res = await request(app).get("/api/tables/orders");
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("pageCount");
      expect(typeof res.body.pageCount).toBe("number");
      expect(res.body.pageCount).toBeGreaterThan(0);
    });

    it("should return the correct amount of rows based on pagination", async () => {
      const res = await request(app).get("/api/tables/orders?page=1");
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.rows)).toBeTruthy();
      expect(res.body.rows.length).toBeLessThanOrEqual(10);
    });

    it("should return the correct page of results based on pagination", async () => {
      const resPage1 = await request(app).get("/api/tables/orders?page=1");
      const resPage2 = await request(app).get("/api/tables/orders?page=2");
      expect(resPage1.statusCode).toEqual(200);
      expect(resPage2.statusCode).toEqual(200);
      expect(Array.isArray(resPage1.body.rows)).toBeTruthy();
      expect(Array.isArray(resPage2.body.rows)).toBeTruthy();
      if (resPage1.body.rows.length > 0 && resPage2.body.rows.length > 0) {
        expect(resPage1.body.rows[0].id).not.toEqual(resPage2.body.rows[0].id);
      }
    });

    it("should return an error if the page query parameter is not a valid number", async () => {
      const res = await request(app).get("/api/tables/orders?page=invalid");
      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBe("Page number must be a valid number");
    });

    it("should return an error if the page query parameter is less than 1", async () => {
      const res = await request(app).get("/api/tables/orders?page=0");
      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBe("Page number must be greater than 0");
    });

    it("should find no results when requesting a page number that is too high", async () => {
      const res = await request(app).get("/api/tables/orders?page=9999");
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.rows)).toBeTruthy();
      expect(res.body.rows.length).toEqual(0);
    });
  });

  describe("sorting", () => {
    it("should return results sorted in ascending order when sortDirection=asc is specified", async () => {
      const res = await request(app).get(
        "/api/tables/orders?sortColumn=id&sortDirection=asc",
      );
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.rows)).toBeTruthy();
      for (let i = 1; i < res.body.rows.length; i++) {
        expect(res.body.rows[i].id).toBeGreaterThanOrEqual(
          res.body.rows[i - 1].id,
        );
      }
    });

    it("should return results sorted in descending order when sortDirection=desc is specified", async () => {
      const res = await request(app).get(
        "/api/tables/orders?sortColumn=id&sortDirection=desc",
      );
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.rows)).toBeTruthy();
      for (let i = 1; i < res.body.rows.length; i++) {
        expect(res.body.rows[i].id).toBeLessThanOrEqual(
          res.body.rows[i - 1].id,
        );
      }
    });

    it("should return results sorted in ascending order by default", async () => {
      const res = await request(app).get("/api/tables/orders?sortColumn=id");
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.rows)).toBeTruthy();
      for (let i = 1; i < res.body.rows.length; i++) {
        expect(res.body.rows[i].id).toBeGreaterThanOrEqual(
          res.body.rows[i - 1].id,
        );
      }
    });

    it("should return an error if the column name is invalid", async () => {
      const res = await request(app).get(
        "/api/tables/orders?sortColumn=invalid_column_name",
      );
      expect(res.statusCode).toEqual(500);
      expect(res.body.error).toBe('Failed to fetch data for table "orders"');
    });

    it("should return an error if an sql injection attempt is made in the sort column name", async () => {
      const res = await request(app).get(
        "/api/tables/orders?sortColumn=;DROP TABLE customers;--",
      );
      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBe("Invalid sort column name");
    });
  });

  describe("filtering", () => {
    it("should filter results based on a single column filter", async () => {
      const res = await request(app).get(
        "/api/tables/customers?columnFilters[first_name]=Alice",
      );
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.rows)).toBeTruthy();
      expect(res.body.rows.length).toBeGreaterThan(0);
      expect(res.body.rows[0].first_name).toBe("Alice");
    });

    it("should filter results based on a boolean column filter", async () => {
      const res = await request(app).get(
        "/api/tables/customers?columnFilters[is_active]=true",
      );
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.rows)).toBeTruthy();
      expect(res.body.rows.length).toBeGreaterThan(0);
      expect(res.body.rows[0].is_active).toBe(true);
    });

    it("should filter results based on a date column filter", async () => {
      const res = await request(app).get(
        "/api/tables/customers?columnFilters[date_of_birth]=1990-01-15",
      );
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.rows)).toBeTruthy();
      expect(res.body.rows.length).toBeGreaterThan(0);
      expect(res.body.rows[0].date_of_birth).toContain("1990-01-15");
    });

    it("should filter results based on a datetime column filter", async () => {
      const res = await request(app).get(
        "/api/tables/customers?columnFilters[created_at]=2026-02-17",
      );
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.rows)).toBeTruthy();
      expect(res.body.rows.length).toBeGreaterThan(0);
      expect(res.body.rows[0].created_at).toContain("2026-02-17");
    });

    it("should filter results based on a partial string match when filtering with a string column filter", async () => {
      const res = await request(app).get(
        "/api/tables/customers?columnFilters[first_name]=Ali",
      );
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.rows)).toBeTruthy();
      expect(res.body.rows.length).toBeGreaterThan(0);
      expect(res.body.rows[0].first_name).toBe("Alice");
    });

    it("should filter results based on a partial match when filtering with a boolean column filter", async () => {
      const res = await request(app).get(
        "/api/tables/customers?columnFilters[is_active]=tru",
      );
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.rows)).toBeTruthy();
      expect(res.body.rows.length).toBeGreaterThan(0);
      expect(res.body.rows[0].is_active).toBe(true);
    });

    it("should filter results based on a partial match when filtering with a date column filter", async () => {
      const res = await request(app).get(
        "/api/tables/customers?columnFilters[date_of_birth]=1990-01",
      );
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.rows)).toBeTruthy();
      expect(res.body.rows.length).toBeGreaterThan(0);
      expect(res.body.rows[0].date_of_birth).toContain("1990-01-15");
    });

    it("should filter results based on a partial match when filtering with a datetime column filter", async () => {
      const res = await request(app).get(
        "/api/tables/customers?columnFilters[created_at]=2026-02",
      );
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.rows)).toBeTruthy();
      expect(res.body.rows.length).toBeGreaterThan(0);
      expect(res.body.rows[0].created_at).toContain("2026-02");
    });

    it("should filter results based on multiple column filters", async () => {
      const res = await request(app).get(
        "/api/tables/customers?columnFilters[first_name]=Alice&columnFilters[is_active]=true",
      );
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.rows)).toBeTruthy();
      expect(res.body.rows.length).toBeGreaterThan(0);
      expect(res.body.rows[0].first_name).toBe("Alice");
      expect(res.body.rows[0].is_active).toBe(true);
    });

    it("should return an empty array when no rows match the columnFilters", async () => {
      const res = await request(app).get(
        "/api/tables/customers?columnFilters[first_name]=NonExistentName",
      );
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.rows)).toBeTruthy();
      expect(res.body.rows.length).toEqual(0);
    });

    it("should return an error if the column filters contain an invalid column name", async () => {
      const res = await request(app).get(
        "/api/tables/customers?columnFilters[invalid_column]=value",
      );
      expect(res.statusCode).toEqual(500);
      expect(res.body.error).toBe('Failed to fetch data for table "customers"');
    });

    it("should return an error if an sql injection attempt is made in the column filters", async () => {
      const res = await request(app).get(
        "/api/tables/customers?columnFilters[first_name;DROP TABLE customers;--]=Alice",
      );
      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBe(
        'Invalid column name in columnFilters: "first_name;DROP TABLE customers;--"',
      );
    });

    it("should return the correct row count and page count when columnFilters are applied", async () => {
      const allRes = await request(app).get("/api/tables/customers");
      const filteredRes = await request(app).get(
        "/api/tables/customers?columnFilters[is_active]=true",
      );
      expect(filteredRes.statusCode).toEqual(200);
      expect(filteredRes.body).toHaveProperty("totalCount");
      expect(filteredRes.body).toHaveProperty("pageCount");
      expect(typeof filteredRes.body.totalCount).toBe("number");
      expect(typeof filteredRes.body.pageCount).toBe("number");
      expect(filteredRes.body.totalCount).toBeGreaterThan(0);
      expect(filteredRes.body.totalCount).toBeLessThan(allRes.body.totalCount);
    });
  });

  describe("combined operations", () => {
    it("should sort and paginate results together correctly", async () => {
      const resPage1 = await request(app).get(
        "/api/tables/orders?sortColumn=id&sortDirection=asc&page=1",
      );
      const resPage2 = await request(app).get(
        "/api/tables/orders?sortColumn=id&sortDirection=asc&page=2",
      );
      expect(resPage1.statusCode).toEqual(200);
      expect(resPage2.statusCode).toEqual(200);
      expect(Array.isArray(resPage1.body.rows)).toBeTruthy();
      expect(Array.isArray(resPage2.body.rows)).toBeTruthy();
      if (resPage1.body.rows.length > 0 && resPage2.body.rows.length > 0) {
        expect(resPage1.body.rows[0].id).toBeLessThan(resPage2.body.rows[0].id);
      }
    });

    it("should filter and paginate results together correctly", async () => {
      const resPage1 = await request(app).get(
        "/api/tables/customers?columnFilters[is_active]=true&page=1",
      );
      const resPage2 = await request(app).get(
        "/api/tables/customers?columnFilters[is_active]=true&page=2",
      );
      expect(resPage1.statusCode).toEqual(200);
      expect(resPage2.statusCode).toEqual(200);
      expect(Array.isArray(resPage1.body.rows)).toBeTruthy();
      expect(Array.isArray(resPage2.body.rows)).toBeTruthy();
      for (const row of resPage1.body.rows) {
        expect(row.is_active).toBe(true);
      }
      for (const row of resPage2.body.rows) {
        expect(row.is_active).toBe(true);
      }
    });

    it("should filter, sort, and paginate results together correctly", async () => {
      const resPage1 = await request(app).get(
        "/api/tables/customers?columnFilters[is_active]=true&sortColumn=id&sortDirection=asc&page=1",
      );
      const resPage2 = await request(app).get(
        "/api/tables/customers?columnFilters[is_active]=true&sortColumn=id&sortDirection=asc&page=2",
      );
      expect(resPage1.statusCode).toEqual(200);
      expect(resPage2.statusCode).toEqual(200);
      expect(Array.isArray(resPage1.body.rows)).toBeTruthy();
      expect(Array.isArray(resPage2.body.rows)).toBeTruthy();
      for (const row of resPage1.body.rows) {
        expect(row.is_active).toBe(true);
      }
      for (const row of resPage2.body.rows) {
        expect(row.is_active).toBe(true);
      }
      if (resPage1.body.rows.length > 0 && resPage2.body.rows.length > 0) {
        expect(resPage1.body.rows[0].id).toBeLessThan(resPage2.body.rows[0].id);
      }
    });
  });
});

describe("PUT /api/tables/:name/rows", () => {
  it("should save a row and return the updated row", async () => {
    const res = await request(app)
      .put("/api/tables/customers/rows/?primaryKeys[id]=1")
      .send({ first_name: "UpdatedName" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.first_name).toBe("UpdatedName");
    await request(app)
      .put("/api/tables/customers/rows/?primaryKeys[id]=1")
      .send({ first_name: "Alice" });
  });

  it("should return an error when trying to save a row in a non-existent table", async () => {
    const res = await request(app)
      .put("/api/tables/non_existent_table/rows/?primaryKeys[id]=1")
      .send({ first_name: "UpdatedName" });
    expect(res.statusCode).toEqual(404);
    expect(res.body.error).toBe('Table "non_existent_table" does not exist');
  });

  it("should return an error when trying to save a non-existent row", async () => {
    const res = await request(app)
      .put("/api/tables/customers/rows/?primaryKeys[id]=9999")
      .send({ first_name: "UpdatedName" });
    expect(res.statusCode).toEqual(404);
    expect(res.body.error).toBe(
      'Row with primary keys "id:9999" not found in table "customers"',
    );
  });

  it("should return an error if the save row query fails", async () => {
    await request(app).get("/api/tables");
    const originalQuery = pool.query;
    pool.query = vi.fn().mockRejectedValue(new Error("Query failed"));
    const res = await request(app)
      .put("/api/tables/customers/rows/?primaryKeys[id]=1")
      .send({ first_name: "UpdatedName" });
    expect(res.statusCode).toEqual(500);
    expect(res.body.error).toBe('Failed to save row in table "customers"');
    pool.query = originalQuery;
  });

  it("should return an error if the request body is empty when saving a row", async () => {
    const res = await request(app)
      .put("/api/tables/customers/rows/?primaryKeys[id]=1")
      .send();
    expect(res.statusCode).toEqual(400);
  });

  it("should return an error if no primary keys are provided when saving a row", async () => {
    const res = await request(app)
      .put("/api/tables/customers/rows/")
      .send({ first_name: "UpdatedName" });
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toBe("At least one primary key is required");
  });

  it("should return an error if an invalid table name is provided when saving a row", async () => {
    const res = await request(app)
      .put("/api/tables/;DROP TABLE customers;--/rows/?primaryKeys[id]=1")
      .send({ first_name: "UpdatedName" });
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toBe("Invalid table name");
  });

  it("should return an error if an sql injection attack is attempted in the updated row", async () => {
    const res = await request(app)
      .put("/api/tables/customers/rows/?primaryKeys[id]=1")
      .send({ "invalid_column;DROP TABLE customers;--": "value" });
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toBe(
      'Invalid column name in updated row: "invalid_column;DROP TABLE customers;--"',
    );
  });

  it("should return an error if an sql injection attack is attempted in the primary keys", async () => {
    const res = await request(app)
      .put(
        "/api/tables/customers/rows/?primaryKeys[id;DROP TABLE customers;--]=1",
      )
      .send({ first_name: "UpdatedName" });
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toBe(
      'Invalid primary key column name: "id;DROP TABLE customers;--"',
    );
  });

  it("should save a row with composite primary keys", async () => {
    const res = await request(app)
      .put(
        "/api/tables/order_items/rows/?primaryKeys[order_id]=1&primaryKeys[product_id]=1",
      )
      .send({ quantity: 5 });
    expect(res.statusCode).toEqual(200);
    expect(res.body.quantity).toBe(5);
    // restore original value
    await request(app)
      .put(
        "/api/tables/order_items/rows/?primaryKeys[order_id]=1&primaryKeys[product_id]=1",
      )
      .send({ quantity: 1 });
  });
});
