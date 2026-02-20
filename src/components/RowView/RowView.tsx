import { Modal } from "../UI/Modal/Modal";
import { useCustomerStore } from "../../store/useCustomerStore";
import "./RowView.css";
import { useState } from "react";

function RowView() {
  const selectedCustomer = useCustomerStore((state) => state.selectedCustomer);
  const closeRowView = useCustomerStore((state) => state.closeRowView);
  const tableProperties = useCustomerStore((state) => state.tableProperties);
  const [editing, setEditing] = useState(false);

  return selectedCustomer ? (
    <Modal onClose={closeRowView}>
      <div className="selected-customer">
        <div className="header">
          <h3>Record details</h3>
          <div className="controls">
            {editing ? (
              <button className="cancel" onClick={() => setEditing(false)}>
                Cancel
              </button>
            ) : (
              <button className="edit" onClick={() => setEditing(true)}>
                Edit
              </button>
            )}
          </div>
        </div>
        <ul>
          {tableProperties.map((tableProperty) => (
            <li>
              <label>{tableProperty}</label>
              {editing ? (
                <input value={selectedCustomer[tableProperty]}></input>
              ) : (
                <div className="property-value">
                  {selectedCustomer[tableProperty]}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  ) : null;
}

export { RowView };
