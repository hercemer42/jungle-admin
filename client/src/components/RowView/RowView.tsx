import { useTableDataStore } from "../../store/useTableDataStore";
import { formatCellValue, formatTableAndColumnNames } from "../../utils/utils";
import { Modal } from "../UI/Modal/Modal";
import styles from "./RowView.module.css";
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

  const primaryKeyColumns = useTableDataStore(
    (state) => state.primaryKeyColumns,
  );

  return selectedRow ? (
    <Modal onClose={closeRowView}>
      <div className={styles.selectedRow}>
        <form
          key={primaryKeyColumns.map((col) => selectedRow[col]).join("-")}
          onSubmit={handleSave}
        >
          <div className={styles.header}>
            <h3>Record details</h3>
            <div>
              {editing ? (
                <>
                  <button
                    type="button"
                    className={styles.cancel}
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </button>
                  <button className={styles.save} type="submit">
                    Save
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className={styles.edit}
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
                <label>{formatTableAndColumnNames(tableProperty.name)}</label>
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
                  <div className={styles.propertyValue}>
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
