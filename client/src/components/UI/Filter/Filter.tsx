import { useMemo } from "react";
import { useTableDataStore } from "../../../store/useTableDataStore.ts";
import type { ColumnFilterProperty } from "../../../types/types.tsx";
import { debounce } from "../../../utils/utils.ts";
import "./Filter.css";

function FilterInput({ filterName }: { filterName: ColumnFilterProperty }) {
  const setFilterProperty = useTableDataStore(
    (state) => state.setFilterProperty,
  );

  const processChange = useMemo(
    () =>
      debounce((filterName: ColumnFilterProperty, value: string) => {
        setFilterProperty(filterName, value);
      }, 300),
    [],
  );

  return (
    <label>
      {filterName}
      <input
        onChange={(e) => processChange(filterName, e.target.value)}
        name="FilterInput"
      />
    </label>
  );
}

function Filter() {
  const setFilterProperty = useTableDataStore(
    (state) => state.setFilterProperty,
  );
  const columnFilters = useTableDataStore((state) => state.columnFilters);
  const tableProperties = useTableDataStore((state) => state.tableProperties);

  const addFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const filterName = e.target.value as ColumnFilterProperty;
    const filter = columnFilters[filterName];
    if (!filter) {
      setFilterProperty(filterName, "");
    }
  };

  return (
    <div className="filter">
      <label>
        Add Filter
        <select onChange={addFilter} defaultValue="">
          <option value="" disabled key="default"></option>
          {tableProperties.map((property) => (
            <option key={property.name}>{property.name}</option>
          ))}
        </select>
      </label>

      {Object.entries(columnFilters).map(([filterName]) => (
        <FilterInput key={filterName} filterName={filterName} />
      ))}
    </div>
  );
}

export { Filter };
