import { describe, it, expect, vi } from "vitest";
import {
  convertServerTypeToInputType,
  convertServerDatesToInputDates,
  removeEmptyFilters,
  debounce,
  formatCellValue,
} from "./utils";
import type { Field } from "../types/types";

describe("convertServerTypeToInputType", () => {
  it("converts boolean to checkbox", () => {
    const fields: Field[] = [{ name: "isActive", type: "boolean", editable: true }];
    expect(convertServerTypeToInputType(fields)[0].type).toBe("checkbox");
  });

  it("converts number to number", () => {
    const fields: Field[] = [{ name: "count", type: "number", editable: true }];
    expect(convertServerTypeToInputType(fields)[0].type).toBe("number");
  });

  it("converts date to date", () => {
    const fields: Field[] = [{ name: "dob", type: "date", editable: true }];
    expect(convertServerTypeToInputType(fields)[0].type).toBe("date");
  });

  it("converts datetime to datetime-local", () => {
    const fields: Field[] = [{ name: "createdAt", type: "datetime", editable: false }];
    expect(convertServerTypeToInputType(fields)[0].type).toBe("datetime-local");
  });

  it("defaults unknown types to text", () => {
    const fields: Field[] = [{ name: "name", type: "varchar", editable: true }];
    expect(convertServerTypeToInputType(fields)[0].type).toBe("text");
  });

  it("preserves name and editable properties", () => {
    const fields: Field[] = [{ name: "id", type: "number", editable: false }];
    const result = convertServerTypeToInputType(fields)[0];
    expect(result.name).toBe("id");
    expect(result.editable).toBe(false);
  });
});

describe("convertServerDatesToInputDates", () => {
  it("converts datetime fields to ISO slice format", () => {
    const fields: Field[] = [{ name: "createdAt", type: "datetime", editable: false }];
    const rows = [{ createdAt: "2026-02-17T11:05:00.000Z" }];
    const result = convertServerDatesToInputDates(rows, fields);
    expect(result[0].createdAt).toBe("2026-02-17T11:05");
  });

  it("converts datetime-local fields to ISO slice format", () => {
    const fields: Field[] = [{ name: "createdAt", type: "datetime-local", editable: false }];
    const rows = [{ createdAt: "2026-02-17T11:05:00.000Z" }];
    const result = convertServerDatesToInputDates(rows, fields);
    expect(result[0].createdAt).toBe("2026-02-17T11:05");
  });

  it("converts date fields to date-only format", () => {
    const fields: Field[] = [{ name: "dob", type: "date", editable: true }];
    const rows = [{ dob: "1990-01-15T00:00:00.000Z" }];
    const result = convertServerDatesToInputDates(rows, fields);
    expect(result[0].dob).toBe("1990-01-15");
  });

  it("leaves non-date fields unchanged", () => {
    const fields: Field[] = [{ name: "name", type: "text", editable: true }];
    const rows = [{ name: "Alice" }];
    const result = convertServerDatesToInputDates(rows, fields);
    expect(result[0].name).toBe("Alice");
  });

  it("handles null date values without crashing", () => {
    const fields: Field[] = [{ name: "createdAt", type: "datetime", editable: false }];
    const rows = [{ createdAt: null }];
    const result = convertServerDatesToInputDates(rows, fields);
    expect(result[0].createdAt).toBe(null);
  });
});

describe("removeEmptyFilters", () => {
  it("removes empty string filters", () => {
    const result = removeEmptyFilters({ name: "", age: "25" });
    expect(result).toEqual({ age: "25" });
  });

  it("returns empty object when all filters are empty", () => {
    const result = removeEmptyFilters({ name: "", age: "" });
    expect(result).toEqual({});
  });

  it("keeps all non-empty filters", () => {
    const result = removeEmptyFilters({ name: "Alice", age: "25" });
    expect(result).toEqual({ name: "Alice", age: "25" });
  });

  it("returns empty object for empty input", () => {
    const result = removeEmptyFilters({});
    expect(result).toEqual({});
  });
});

describe("debounce", () => {
  it("delays function execution", () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced("arg1");
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledWith("arg1");

    vi.useRealTimers();
  });

  it("resets the timer on subsequent calls", () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced("first");
    vi.advanceTimersByTime(200);
    debounced("second");
    vi.advanceTimersByTime(200);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("second");

    vi.useRealTimers();
  });
});

describe("formatCellValue", () => {
  it("returns 'Yes' for truthy checkbox values", () => {
    expect(formatCellValue(true, "checkbox")).toBe("Yes");
    expect(formatCellValue(1, "checkbox")).toBe("Yes");
  });

  it("returns 'No' for falsy checkbox values", () => {
    expect(formatCellValue(false, "checkbox")).toBe("No");
    expect(formatCellValue(0, "checkbox")).toBe("No");
    expect(formatCellValue(null, "checkbox")).toBe("No");
  });

  it("formats datetime-local values with toLocaleString", () => {
    const result = formatCellValue("2026-02-17T11:05:00.000Z", "datetime-local");
    expect(result).toBe(new Date("2026-02-17T11:05:00.000Z").toLocaleString());
  });

  it("formats date values with toLocaleDateString", () => {
    const result = formatCellValue("1990-01-15", "date");
    expect(result).toBe(new Date("1990-01-15").toLocaleDateString());
  });

  it("returns string for other types", () => {
    expect(formatCellValue("Alice", "text")).toBe("Alice");
    expect(formatCellValue(42, "number")).toBe("42");
  });

  it("returns empty string for null/undefined", () => {
    expect(formatCellValue(null, "text")).toBe("");
    expect(formatCellValue(undefined, "text")).toBe("");
  });
});
