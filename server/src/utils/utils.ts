const oidToType: Record<number, string> = {
  16: "boolean", // bool
  20: "number", // int8
  21: "number", // int2
  23: "number", // int4
  700: "number", // float4
  701: "number", // float8
  1700: "number", // numeric
  25: "string", // text
  1043: "string", // varchar
  1042: "string", // char
  1082: "date", // date
  1114: "datetime", // timestamp
  1184: "datetime", // timestamptz
};

function getDataFromPostgresField(
  field: any,
  nonEditableColumns: Set<string>,
  primaryKeyColumns: Set<string>,
) {
  const type = oidToType[field.dataTypeID] || "string";
  return {
    type,
    name: field.name,
    editable: type !== "datetime" && !nonEditableColumns.has(field.name),
    primaryKey: primaryKeyColumns.has(field.name),
  };
}

function validateParameter(columnName: string): boolean {
  return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(columnName);
}

export { getDataFromPostgresField, validateParameter };
