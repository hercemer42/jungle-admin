type Row = Record<string, string | number | boolean | null | undefined>;
type Field = { name: string; type: string; editable: boolean };
type ColumnFilterProperty = keyof Row;
type ColumnFilters = Partial<Record<ColumnFilterProperty, string>>;
type SortColumn = ColumnFilterProperty | null;
type SortDirection = "asc" | "desc" | null;

export type {
  Row,
  Field,
  ColumnFilters,
  SortColumn,
  SortDirection,
  ColumnFilterProperty,
};
