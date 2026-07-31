import { useState } from "react";
import { closeAccount, TokenExpiredError, updateAccountByAdmin } from "../../api/auth";
import ConfirmModal from "../modal/ConfirmModal";

const EDITABLE_FIELDS = ["accountType", "status"];

function collectColumns(rows) {
   const columns = [];
   const seen = new Set();
   rows.forEach((row) => {
      Object.keys(row || {}).forEach((key) => {
         if (!seen.has(key)) {
            seen.add(key);
            columns.push(key);
         }
      });
   });
   return columns;
}

function formatCellValue(value) {
   if (value === null || value === undefined) return "";
   if (typeof value === "object") return JSON.stringify(value);
   return String(value);
}

function AccountsTable({ rows, token, clearToken, onAccountsChange, emptyMessage }) {
   const columns = collectColumns(rows);
   const [editingAccountId, setEditingAccountId] = useState(null);
   const [editValues, setEditValues] = useState({});
   const [pendingUpdate, setPendingUpdate] = useState(null);
   const [pendingClose, setPendingClose] = useState(null);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [error, setError] = useState("");

   if (rows.length === 0) {
      return <p>{emptyMessage}</p>;
   }

   const startEditing = (row) => {
      setError("");
      setEditingAccountId(row._id);
      setEditValues({
         accountType: row.accountType ?? "",
         status: row.status ?? "",
      });
   };

   const cancelEditing = () => {
      setEditingAccountId(null);
      setEditValues({});
   };

   const handleFieldChange = (field, value) => {
      setEditValues((previous) => ({ ...previous, [field]: value }));
   };

   const requestUpdate = (row) => {
      setPendingUpdate({ accountId: row._id, balance: row.balance, values: { ...editValues } });
   };

   const confirmUpdate = async () => {
      if (!pendingUpdate) return;
      setError("");
      setIsSubmitting(true);
      try {
         await updateAccountByAdmin(token, pendingUpdate.accountId, {
            balance: pendingUpdate.balance,
            accountType: pendingUpdate.values.accountType,
            status: pendingUpdate.values.status,
         });
         onAccountsChange((previousRows) =>
            previousRows.map((row) =>
               row._id === pendingUpdate.accountId ? { ...row, ...pendingUpdate.values } : row,
            ),
         );
         setPendingUpdate(null);
         setEditingAccountId(null);
         setEditValues({});
      } catch (requestError) {
         if (requestError instanceof TokenExpiredError) {
            clearToken();
         }
         setError(
            requestError instanceof Error ? requestError.message : "Unable to update account.",
         );
         setPendingUpdate(null);
      } finally {
         setIsSubmitting(false);
      }
   };

   const requestClose = (row) => {
      setPendingClose(row);
   };

   const confirmClose = async () => {
      if (!pendingClose) return;
      setError("");
      setIsSubmitting(true);
      try {
         await closeAccount(token, pendingClose._id);
         onAccountsChange((previousRows) =>
            previousRows.map((row) =>
               row._id === pendingClose._id ? { ...row, status: "closed" } : row,
            ),
         );
         setPendingClose(null);
      } catch (requestError) {
         if (requestError instanceof TokenExpiredError) {
            clearToken();
         }
         setError(
            requestError instanceof Error ? requestError.message : "Unable to close account.",
         );
         setPendingClose(null);
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <div className="admin-table-wrapper">
         {error && (
            <p className="auth-message auth-error" role="alert">
               {error}
            </p>
         )}
         <table className="admin-table">
            <thead>
               <tr>
                  {columns.map((column) => (
                     <th key={column}>{column}</th>
                  ))}
                  <th>Actions</th>
               </tr>
            </thead>
            <tbody>
               {rows.map((row, index) => {
                  const rowKey = row._id || row.id || index;
                  const isEditing = editingAccountId === row._id;
                  return (
                     <tr key={rowKey}>
                        {columns.map((column) => (
                           <td key={column}>
                              {isEditing && EDITABLE_FIELDS.includes(column) ? (
                                 <input
                                    className="admin-inline-input"
                                    type="text"
                                    value={editValues[column] ?? ""}
                                    onChange={(event) => handleFieldChange(column, event.target.value)}
                                 />
                              ) : (
                                 formatCellValue(row[column])
                              )}
                           </td>
                        ))}
                        <td>
                           <div className="admin-row-actions">
                              {isEditing ? (
                                 <>
                                    <button
                                       type="button"
                                       className="admin-icon-btn admin-icon-btn-submit"
                                       aria-label="Submit account changes"
                                       title="Submit"
                                       onClick={() => requestUpdate(row)}
                                    >
                                       ✓
                                    </button>
                                    <button
                                       type="button"
                                       className="admin-icon-btn admin-icon-btn-cancel"
                                       aria-label="Cancel editing"
                                       title="Cancel"
                                       onClick={cancelEditing}
                                    >
                                       ✕
                                    </button>
                                 </>
                              ) : (
                                 <>
                                    <button
                                       type="button"
                                       className="admin-icon-btn admin-icon-btn-edit"
                                       aria-label="Edit account"
                                       title="Edit"
                                       onClick={() => startEditing(row)}
                                    >
                                       ✎
                                    </button>
                                    <button
                                       type="button"
                                       className="admin-icon-btn admin-icon-btn-deactivate"
                                       aria-label="Close account"
                                       title="Close account"
                                       disabled={row.status === "closed"}
                                       onClick={() => requestClose(row)}
                                    >
                                       ⛔
                                    </button>
                                 </>
                              )}
                           </div>
                        </td>
                     </tr>
                  );
               })}
            </tbody>
         </table>

         {pendingUpdate && (
            <ConfirmModal
               title="Confirm account update"
               message="Are you sure you want to update this account with the following information?"
               details={[
                  { label: "Account type", value: pendingUpdate.values.accountType },
                  { label: "Status", value: pendingUpdate.values.status },
                  { label: "Balance", value: formatCellValue(pendingUpdate.balance) },
               ]}
               confirmLabel="Update account"
               cancelLabel="Cancel"
               isSubmitting={isSubmitting}
               onConfirm={confirmUpdate}
               onCancel={() => setPendingUpdate(null)}
            />
         )}

         {pendingClose && (
            <ConfirmModal
               title="Confirm account closure"
               message={`Are you sure you want to close account ${pendingClose._id}?`}
               confirmLabel="Close account"
               cancelLabel="Cancel"
               isSubmitting={isSubmitting}
               onConfirm={confirmClose}
               onCancel={() => setPendingClose(null)}
            />
         )}
      </div>
   );
}

export default AccountsTable;
