import { useTableDataStore } from "../../store/useTableDataStore";
import type { Row } from "../../data/table_data";
import { useEffect, useMemo, useState } from "react";

export function useTable() {
  const rows = useTableDataStore((state) => state.rows);
  const tableProperties = useTableDataStore((state) => state.tableProperties);
  const filters = useTableDataStore((state) => state.filters);
  const openRowView = useTableDataStore((state) => state.openRowView);
  const [sortColumn, setSortColumn] = useState<keyof Row | null>(null);
  const [sortDesc, setSortDesc] = useState(true);
  const [page, setPage] = useState(1);
  const recordsPerPage = 10;
  const startRow = (page - 1) * recordsPerPage;

  const filteredRows = useMemo(() => {
    return rows.filter((row) =>
      Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        const rowValue = row[key] + "";
        return rowValue.includes(value);
      }),
    );
  }, [rows, filters]);

  const pageCount = Math.ceil(filteredRows.length / recordsPerPage);

  const sort = (property: keyof Row) => {
    if (property === sortColumn) {
      if (sortDesc) {
        setSortDesc(false);
        return;
      }

      setSortColumn(null);
      return;
    }

    setSortDesc(true);
    setSortColumn(property);
  };

  const sortedRows = useMemo(
    () =>
      filteredRows.toSorted((a, b) => {
        if (!sortColumn) return 0;
        const aVal = a[sortColumn] || "";
        const bVal = b[sortColumn] || "";

        if (aVal > bVal) return sortDesc ? -1 : 1;
        if (aVal < bVal) return sortDesc ? 1 : -1;
        return 0;
      }),
    [filteredRows, sortColumn, sortDesc],
  );

  const openRow = (row: Row) => {
    openRowView(row);
  };

  useEffect(() => {
    setPage(1);
  }, [filters, sortedRows]);

  const paginatedRows = sortedRows.slice(startRow, startRow + recordsPerPage);

  const nextPage = () => {
    if (page >= pageCount) return;
    setPage(page + 1);
  };

  const previousPage = () => {
    if (page === 1) return;
    setPage(page - 1);
  };

  return {
    tableProperties,
    sort,
    sortColumn,
    paginatedRows,
    sortDesc,
    page,
    nextPage,
    previousPage,
    pageCount,
    openRow,
  };
}
