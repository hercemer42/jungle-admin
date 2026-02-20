import { useCustomerStore, type Customer } from "../../../store/useCustomerStore.ts"
import "./Filter.css"

function Filter () {
    const setFilterProperty = useCustomerStore(state => state.setFilterProperty)
    const filters = useCustomerStore(state => state.filters)
    const tableProperties = useCustomerStore(state => state.tableProperties)

    const addFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const filterName = e.target.value as keyof Customer
        const filter = filters[filterName]
        if (!filter) {
            setFilterProperty(filterName, '')    
        }
    }

    return (
        <div className="filter">
            <label>
                Add Filter
                <select onChange={addFilter} defaultValue = "">
                    <option value = "" disabled key="default"></option>
                    {tableProperties.map((property) => (
                        <option key={property}>{property}</option>
                    ))}
                </select>
            </label>

            {Object.entries(filters).map(filter => (
                <label key={filter[0]}>
                    {filter[0]} : <input onChange={e => setFilterProperty(filter[0] as keyof Customer, e.target.value)} name="FilterInput"/>
                </label>
            ))}

        </div>
    )
}

export { Filter }