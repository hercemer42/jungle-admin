import { formatCellValue } from "../../utils/utils";
import { Modal } from "../UI/Modal/Modal";
import "./RowView.css";
import useRowView from "./useRowView";

function RowView() {
  const {
    handleSave,
    editing,
    setEditing,
    selectedRow,
    closeRowView,
    tableProperties,
  } = useRowView();

  return selectedRow ? (
    <Modal onClose={closeRowView}>
      <div className="selected-row">
        <form onSubmit={handleSave}>
          <div className="header">
            <h3>Record details</h3>
            <div className="controls">
              {editing ? (
                <>
                  <button
                    type="button"
                    className="cancel"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </button>
                  <button className="save" type="submit">
                    Save
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="edit"
                  onClick={() => setEditing(true)}
                >
                  Edit
                </button>
              )}
            </div>
          </div>
          <ul>
            {tableProperties.map((tableProperty) => (
              <li key={tableProperty.name}>
                <label>{tableProperty.name}</label>
                {editing && tableProperty.editable ? (
                  <input
                    type={tableProperty.type}
                    name={tableProperty.name}
                    {...(tableProperty.type === "checkbox"
                      ? {
                          defaultChecked: Boolean(
                            selectedRow[tableProperty.name],
                          ),
                        }
                      : {
                          defaultValue: String(
                            selectedRow[tableProperty.name] ?? "",
                          ),
                        })}
                  ></input>
                ) : (
                  <div className="property-value">
                    {formatCellValue(
                      selectedRow[tableProperty.name],
                      tableProperty.type,
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </form>
      </div>
    </Modal>
  ) : null;
}

export { RowView };
