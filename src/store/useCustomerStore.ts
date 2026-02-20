import { create } from 'zustand'
import { customers, type Customer } from '../data/customer_data.ts'

interface CustomerStore {
    customers: Customer[]
    tableProperties: (keyof Customer)[]
    filters: Partial<Record<keyof Customer, string>>
    setFilterProperty: (filterProperty: keyof Customer, filterValue: string) => void
}

const useCustomerStore = create<CustomerStore>((set) => ({
    customers: customers,
    tableProperties : Object.keys(customers[0]) as (keyof Customer)[],
    filters: {},
    setFilterProperty : (filterProperty, filterValue) => set(state => ({
        filters: { ...state.filters, [filterProperty]: filterValue}
    }))
}))

export { useCustomerStore, type Customer }