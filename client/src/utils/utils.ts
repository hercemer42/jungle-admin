import type { ColumnFilters, Field, Row } from "../types/types";

const convertServerTypeToInputType = (serverTypes: Field[]): Field[] => {
  return serverTypes.map((field) => ({
    ...field,
    type: (() => {
      switch (field.type) {
        case "boolean":
          return "checkbox";
        case "number":
          return "number";
        case "date":
          return "date";
        case "datetime":
          return "datetime-local";
        default:
          return "text";
      }
    })(),
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

const debounce = <T extends unknown[]>(func: (...args: T) => void, delay: number) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: T) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

export {
  convertServerTypeToInputType,
  convertServerDatesToInputDates,
  removeEmptyFilters,
  debounce,
};
