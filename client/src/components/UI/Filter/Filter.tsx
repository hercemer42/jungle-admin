import {
  useTableDataStore,
  type Row,
} from "../../../store/useTableDataStore.ts";
import "./Filter.css";

function Filter() {
  const setFilterProperty = useTableDataStore(
    (state) => state.setFilterProperty,
  );
  const filters = useTableDataStore((state) => state.filters);
  const tableProperties = useTableDataStore((state) => state.tableProperties);

  const addFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const filterName = e.target.value as keyof Row;
    const filter = filters[filterName];
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
            <option key={property}>{property}</option>
          ))}
        </select>
      </label>

      {Object.entries(filters).map((filter) => (
        <label key={filter[0]}>
          {filter[0]} :{" "}
          <input
            onChange={(e) =>
              setFilterProperty(filter[0] as keyof Row, e.target.value)
            }
            name="FilterInput"
          />
        </label>
      ))}
    </div>
  );
}

export { Filter };
