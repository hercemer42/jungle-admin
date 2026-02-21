import { Modal } from "../UI/Modal/Modal";
import { useTableDataStore } from "../../store/useTableDataStore";
import "./RowView.css";
import { useState } from "react";

function RowView() {
  const selectedRow = useTableDataStore((state) => state.selectedRow);
  const closeRowView = useTableDataStore((state) => state.closeRowView);
  const tableProperties = useTableDataStore((state) => state.tableProperties);
  const [editing, setEditing] = useState(false);

  return selectedRow ? (
    <Modal onClose={closeRowView}>
      <div className="selected-row">
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
            <li key={tableProperty}>
              <label>{tableProperty}</label>
              {editing ? (
                <input
                  defaultValue={String(selectedRow[tableProperty])}
                ></input>
              ) : (
                <div className="property-value">
                  {selectedRow[tableProperty]}
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
