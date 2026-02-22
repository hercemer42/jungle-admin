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

function getDataFromPostgresField(field: any) {
  return {
    type: oidToType[field.dataTypeID] || "string",
    name: field.name,
  };
}

export { getDataFromPostgresField };
