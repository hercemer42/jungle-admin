import type { Field } from "../store/useTableDataStore";

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

const convertServerDatesToInputDates = (
  rows: Record<string, any>[],
  fields: Field[],
) => {
  return rows.map((row) => {
    const convertedRow: Record<string, any> = { ...row };
    fields.forEach((field) => {
      if (field.type === "datetime" && row[field.name]) {
        const date = new Date(row[field.name]);
        convertedRow[field.name] = date.toISOString().slice(0, 16);
      }
      if (field.type === "date" && row[field.name]) {
        const date = new Date(row[field.name]);
        convertedRow[field.name] = date.toISOString().slice(0, 10);
      }
    });
    return convertedRow;
  });
};

export { convertServerTypeToInputType, convertServerDatesToInputDates };
