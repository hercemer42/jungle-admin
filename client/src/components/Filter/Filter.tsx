import { useMemo } from "react";
import { useTableDataStore } from "../../store/useTableDataStore.ts";
import type { ColumnFilterProperty } from "../../types/types.tsx";
import { debounce, formatTableAndColumnNames } from "../../utils/utils.ts";
import "./Filter.css";

function FilterInput({ filterName }: { filterName: ColumnFilterProperty }) {
  const setFilterProperty = useTableDataStore(
    (state) => state.setFilterProperty,
  );
  const removeFilterProperty = useTableDataStore(
    (state) => state.removeFilterProperty,
  );

  const processChange = useMemo(
    () =>
      debounce((filterName: ColumnFilterProperty, value: string) => {
        setFilterProperty(filterName, value);
      }, 300),
    [setFilterProperty],
  );

  return (
    <div className="filter-input">
      <label>
        <span>{formatTableAndColumnNames(filterName)}</span>
        <input
          onChange={(e) => processChange(filterName, e.target.value)}
          name="FilterInput"
        />
      </label>
      <span
        className="removeFilter"
        onClick={() => removeFilterProperty(filterName)}
      >
        ✕
      </span>
    </div>
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
    e.target.value = "";
  };

  return (
    <div className="filter">
      <label>
        Add Filter
        <select onChange={addFilter} defaultValue="">
          <option value="" disabled hidden key="default"></option>
          {tableProperties.map((property) => (
            <option key={property.name} value={property.name}>
              {formatTableAndColumnNames(property.name)}
            </option>
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
