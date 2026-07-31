import { useState } from "react";

const TABS = [
   { id: "users", label: "Users" },
   { id: "accounts", label: "Accounts" },
   { id: "transactions", label: "Transactions" },
];

function AdminController() {
   const [activeTab, setActiveTab] = useState(TABS[0].id);

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
            {activeTab === "users" && <p>Users list coming soon.</p>}
            {activeTab === "accounts" && <p>Accounts list coming soon.</p>}
            {activeTab === "transactions" && <p>Transactions list coming soon.</p>}
         </div>
      </div>
   );
}

export default AdminController;
