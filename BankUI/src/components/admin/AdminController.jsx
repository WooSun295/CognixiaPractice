import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/useAuth";
import { getAllAccounts, getAllTransactions, getAllUsers, TokenExpiredError } from "../../api/auth";
import UsersTable from "./UsersTable";
import AccountsTable from "./AccountsTable";

const TABS = [
   { id: "users", label: "Users" },
   { id: "accounts", label: "Accounts" },
   { id: "transactions", label: "Transactions" },
];

// Builds the union of keys across all rows so the table has consistent
// columns even when some records are missing certain fields.
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

function DataTable({ rows, emptyMessage }) {
   const columns = useMemo(() => collectColumns(rows), [rows]);

   if (rows.length === 0) {
      return <p>{emptyMessage}</p>;
   }

   return (
      <div className="admin-table-wrapper">
         <table className="admin-table">
            <thead>
               <tr>
                  {columns.map((column) => (
                     <th key={column}>{column}</th>
                  ))}
               </tr>
            </thead>
            <tbody>
               {rows.map((row, index) => (
                  <tr key={row._id || row.id || index}>
                     {columns.map((column) => (
                        <td key={column}>{formatCellValue(row[column])}</td>
                     ))}
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
}

function AdminController() {
   const { token, clearToken } = useAuth();
   const [activeTab, setActiveTab] = useState(TABS[0].id);
   const [users, setUsers] = useState([]);
   const [accounts, setAccounts] = useState([]);
   const [transactions, setTransactions] = useState([]);
   const [isLoading, setIsLoading] = useState(Boolean(token));
   const [error, setError] = useState(
      token ? "" : "You must be logged in as an administrator to view this page.",
   );

   useEffect(() => {
      let isMounted = true;

      if (!token) {
         return () => {
            isMounted = false;
         };
      }

      Promise.all([
         getAllUsers(token),
         getAllAccounts(token),
         getAllTransactions(token),
      ])
         .then(([usersData, accountsData, transactionsData]) => {
            if (!isMounted) return;
            setUsers(usersData);
            setAccounts(accountsData);
            setTransactions(transactionsData);
         })
         .catch((requestError) => {
            if (!isMounted) return;
            if (requestError instanceof TokenExpiredError) {
               clearToken();
            }
            setError(
               requestError instanceof Error
                  ? requestError.message
                  : "Unable to load admin data.",
            );
         })
         .finally(() => {
            if (isMounted) setIsLoading(false);
         });

      return () => {
         isMounted = false;
      };
   }, [token, clearToken]);

   return (
      <div className="admin-controller">
         <h1>Admin Controller</h1>
         <div className="admin-tabs" role="tablist">
            {TABS.map((tab) => (
               <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  className={`admin-tab${activeTab === tab.id ? " admin-tab-active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
               >
                  {tab.label}
               </button>
            ))}
         </div>
         <div className="admin-tab-panel" role="tabpanel">
            {isLoading ? (
               <p>Loading admin data...</p>
            ) : error ? (
               <p className="auth-message auth-error" role="alert">{error}</p>
            ) : (
               <>
                  {activeTab === "users" && (
                     <UsersTable
                        rows={users}
                        token={token}
                        clearToken={clearToken}
                        onUsersChange={setUsers}
                        emptyMessage="No users found."
                     />
                  )}
                  {activeTab === "accounts" && (
                     <AccountsTable
                        rows={accounts}
                        token={token}
                        clearToken={clearToken}
                        onAccountsChange={setAccounts}
                        emptyMessage="No accounts found."
                     />
                  )}
                  {activeTab === "transactions" && (
                     <DataTable rows={transactions} emptyMessage="No transactions found." />
                  )}
               </>
            )}
         </div>
      </div>
   );
}

export default AdminController;
