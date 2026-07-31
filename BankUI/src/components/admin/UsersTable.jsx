import { useState } from "react";
import { createUserByAdmin, deactivateUserByAdmin, TokenExpiredError, updateUserByAdmin } from "../../api/auth";
import ConfirmModal from "../modal/ConfirmModal";
import CreateUserModal from "./CreateUserModal";

const EDITABLE_FIELDS = ["name", "email", "status", "auth"];

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

function UsersTable({ rows, token, clearToken, onUsersChange, emptyMessage }) {
   const columns = collectColumns(rows);
   const [editingUserId, setEditingUserId] = useState(null);
   const [editValues, setEditValues] = useState({});
   const [pendingUpdate, setPendingUpdate] = useState(null);
   const [pendingDeactivate, setPendingDeactivate] = useState(null);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [error, setError] = useState("");
   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
   const [isCreatingUser, setIsCreatingUser] = useState(false);
   const [createError, setCreateError] = useState("");

   const startEditing = (row) => {
      setError("");
      setEditingUserId(row._id);
      setEditValues({
         name: row.name ?? "",
         email: row.email ?? "",
         status: row.status ?? "",
         auth: row.auth ?? "",
      });
   };

   const cancelEditing = () => {
      setEditingUserId(null);
      setEditValues({});
   };

   const handleFieldChange = (field, value) => {
      setEditValues((previous) => ({ ...previous, [field]: value }));
   };

   const requestUpdate = (row) => {
      setPendingUpdate({ userId: row._id, values: { ...editValues } });
   };

   const confirmUpdate = async () => {
      if (!pendingUpdate) return;
      setError("");
      setIsSubmitting(true);
      try {
         await updateUserByAdmin(token, pendingUpdate.userId, pendingUpdate.values);
         onUsersChange((previousRows) =>
            previousRows.map((row) =>
               row._id === pendingUpdate.userId ? { ...row, ...pendingUpdate.values } : row,
            ),
         );
         setPendingUpdate(null);
         setEditingUserId(null);
         setEditValues({});
      } catch (requestError) {
         if (requestError instanceof TokenExpiredError) {
            clearToken();
         }
         setError(
            requestError instanceof Error ? requestError.message : "Unable to update user.",
         );
         setPendingUpdate(null);
      } finally {
         setIsSubmitting(false);
      }
   };

   const requestDeactivate = (row) => {
      setPendingDeactivate(row);
   };

   const confirmDeactivate = async () => {
      if (!pendingDeactivate) return;
      setError("");
      setIsSubmitting(true);
      try {
         await deactivateUserByAdmin(token, pendingDeactivate._id);
         onUsersChange((previousRows) =>
            previousRows.map((row) =>
               row._id === pendingDeactivate._id ? { ...row, status: "deactivated" } : row,
            ),
         );
         setPendingDeactivate(null);
      } catch (requestError) {
         if (requestError instanceof TokenExpiredError) {
            clearToken();
         }
         setError(
            requestError instanceof Error ? requestError.message : "Unable to deactivate user.",
         );
         setPendingDeactivate(null);
      } finally {
         setIsSubmitting(false);
      }
   };

   const handleCreateUser = async (values) => {
      setCreateError("");
      setIsCreatingUser(true);
      try {
         await createUserByAdmin(token, values);
         window.location.reload();
      } catch (requestError) {
         if (requestError instanceof TokenExpiredError) {
            clearToken();
         }
         setCreateError(
            requestError instanceof Error ? requestError.message : "Unable to create user.",
         );
         setIsCreatingUser(false);
      }
   };

   return (
      <div className="admin-table-wrapper">
         <div className="admin-table-toolbar">
            <button
               type="button"
               className="admin-icon-btn admin-icon-btn-create"
               aria-label="Create user"
               title="Create user"
               onClick={() => {
                  setCreateError("");
                  setIsCreateModalOpen(true);
               }}
            >
               +
            </button>
         </div>
         {error && (
            <p className="auth-message auth-error" role="alert">
               {error}
            </p>
         )}
         {rows.length === 0 ? (
            <p>{emptyMessage}</p>
         ) : (
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
                  const isEditing = editingUserId === row._id;
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
                                       aria-label="Submit user changes"
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
                                       aria-label="Edit user"
                                       title="Edit"
                                       onClick={() => startEditing(row)}
                                    >
                                       ✎
                                    </button>
                                    <button
                                       type="button"
                                       className="admin-icon-btn admin-icon-btn-deactivate"
                                       aria-label="Deactivate user"
                                       title="Deactivate"
                                       disabled={row.status === "deactivated"}
                                       onClick={() => requestDeactivate(row)}
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
         )}

         {pendingUpdate && (
            <ConfirmModal
               title="Confirm user update"
               message="Are you sure you want to update this user with the following information?"
               details={[
                  { label: "Name", value: pendingUpdate.values.name },
                  { label: "Email", value: pendingUpdate.values.email },
                  { label: "Status", value: pendingUpdate.values.status },
                  { label: "Auth", value: pendingUpdate.values.auth },
               ]}
               confirmLabel="Update user"
               cancelLabel="Cancel"
               isSubmitting={isSubmitting}
               onConfirm={confirmUpdate}
               onCancel={() => setPendingUpdate(null)}
            />
         )}

         {pendingDeactivate && (
            <ConfirmModal
               title="Confirm user deactivation"
               message={`Are you sure you want to deactivate ${pendingDeactivate.name || pendingDeactivate.email || "this user"}?`}
               confirmLabel="Deactivate user"
               cancelLabel="Cancel"
               isSubmitting={isSubmitting}
               onConfirm={confirmDeactivate}
               onCancel={() => setPendingDeactivate(null)}
            />
         )}

         {isCreateModalOpen && (
            <CreateUserModal
               isSubmitting={isCreatingUser}
               error={createError}
               onCreate={handleCreateUser}
               onCancel={() => setIsCreateModalOpen(false)}
            />
         )}
      </div>
   );
}

export default UsersTable;
