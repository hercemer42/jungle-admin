import type { ColumnFilters, Field, Row } from "../types/types";

const convertServerTypeToInputType = (serverTypes: Field[]): Field[] => {
  const TYPE_MAP: Record<string, string> = {
    boolean: "checkbox",
    number: "number",
    date: "date",
    datetime: "datetime-local",
  };

  return serverTypes.map((field) => ({
    ...field,
    type: TYPE_MAP[field.type] || "text",
  }));
};

const convertServerDatesToInputDates = (rows: Row[], fields: Field[]) => {
  return rows.map((row) => {
    const convertedRow: Row = { ...row };
    fields.forEach((field) => {
      if (
        (field.type === "datetime" || field.type === "datetime-local") &&
        row[field.name]
      ) {
        const date = new Date(row[field.name] as string);
        convertedRow[field.name] = date.toISOString().slice(0, 16);
      }
      if (field.type === "date" && row[field.name]) {
        const date = new Date(row[field.name] as string);
        convertedRow[field.name] = date.toISOString().slice(0, 10);
      }
    });
    return convertedRow;
  });
};

const removeEmptyFilters = (filters: ColumnFilters) => {
  const cleanedFilters: ColumnFilters = {};
  for (const key in filters) {
    if (filters[key]) {
      cleanedFilters[key] = filters[key];
    }
  }
  return cleanedFilters;
};

const debounce = <T extends unknown[]>(
  func: (...args: T) => void,
  delay: number,
) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: T) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const formatCellValue = (value: Row[string], type: string) => {
  if (type === "checkbox") {
    return value ? "Yes" : "No";
  }
  if (type === "datetime-local") {
    const date = new Date(value as string);
    return date.toLocaleString();
  }
  if (type === "date") {
    const date = new Date(value as string);
    return date.toLocaleDateString();
  }
  return String(value ?? "");
};

export {
  convertServerTypeToInputType,
  convertServerDatesToInputDates,
  removeEmptyFilters,
  debounce,
  formatCellValue,
};
