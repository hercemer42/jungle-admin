export type SortDirection = "asc" | "desc";

export interface ConstraintRow {
  column_name: string;
  constraint_type: string;
}

export interface PgField {
  name: string;
  dataTypeID: number;
}
