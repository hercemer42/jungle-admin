import { useCustomerStore } from "../../store/useCustomerStore";
import type { Customer } from "../../data/customer_data";
import { useEffect, useMemo, useState } from "react";

export function useTable() {
  const customers = useCustomerStore((state) => state.customers);
  const tableProperties = useCustomerStore((state) => state.tableProperties);
  const filters = useCustomerStore((state) => state.filters);
  const openRowView = useCustomerStore((state) => state.openRowView);
  const [sortColumn, setSortColumn] = useState<keyof Customer | null>(null);
  const [sortDesc, setSortDesc] = useState(true);
  const [page, setPage] = useState(1);
  const recordsPerPage = 10;
  const startRow = (page - 1) * recordsPerPage;

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) =>
      Object.entries(filters).every((filter) => {
        const customerValue = customer[filter[0] as keyof Customer] + "";
        return customerValue.includes(filter[1]);
      }),
    );
  }, [customers, filters]);

  const pageCount = Math.ceil(filteredCustomers.length / recordsPerPage);

  const sort = (property: keyof Customer) => {
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

  const sortedCustomers = useMemo(
    () =>
      filteredCustomers.toSorted((a, b) => {
        if (!sortColumn) return 0;
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];

        if (aVal > bVal) return sortDesc ? 1 : -1;
        if (aVal < bVal) return sortDesc ? -1 : 1;
        return 0;
      }),
    [filteredCustomers, sortColumn, sortDesc],
  );

  const openCustomerRow = (customer: Customer) => {
    openRowView(customer);
  };

  useEffect(() => {
    setPage(1);
  }, [filters, sortedCustomers]);

  const paginatedCustomers = sortedCustomers.slice(
    startRow,
    startRow + recordsPerPage,
  );

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
    paginatedCustomers,
    sortDesc,
    page,
    nextPage,
    previousPage,
    pageCount,
    openCustomerRow,
  };
}
