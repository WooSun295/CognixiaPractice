import { useEffect, useState } from "react";
import {
   createTransaction,
   getAccountTransactions,
   getUserAccounts,
} from "../../api/auth";
import { useAuth } from "../../context/useAuth";
import Form from "../form/Form";

function AccountDetails({ accountId, navigate }) {
   const { token, clearToken } = useAuth();
   const [account, setAccount] = useState(null);
   const [transactions, setTransactions] = useState([]);
   const [error, setError] = useState("");
   const [operation, setOperation] = useState(null);
   const [otherAccounts, setOtherAccounts] = useState([]);
   const [isSubmitting, setIsSubmitting] = useState(false);

   useEffect(() => {
      if (!token) {
         navigate("/login");
         return;
      }

      getAccountTransactions(token, accountId)
         .then((data) => {
            setAccount(data.account || data);
            setTransactions(data.transactions);
         })
         .catch((requestError) => {
            if (requestError.message.includes("401")) {
               clearToken();
               navigate("/login");
               return;
            }
            setError(
               requestError instanceof Error
                  ? requestError.message
                  : "Unable to load account.",
            );
         });
   }, [accountId, clearToken, navigate, token]);

   const openOperation = async (nextOperation) => {
      setError("");
      if (nextOperation !== "transfer") {
         setOperation(nextOperation);
         navigate(`/accounts/${accountId}/transactions`);
         return;
      }

      try {
         const data = await getUserAccounts(token);
         const accounts = data.accounts.filter((item) => item._id !== accountId);
         if (accounts.length === 0) {
            setError("You need another account before you can make a transfer.");
            return;
         }
         setOtherAccounts(accounts);
         setOperation(nextOperation);
         navigate(`/accounts/${accountId}/transactions`);
      } catch (requestError) {
         if (requestError.message.includes("401")) {
            clearToken();
            navigate("/login");
            return;
         }
         setError(
            requestError instanceof Error
               ? requestError.message
               : "Unable to load accounts.",
         );
      }
   };

   const handleTransaction = async (values) => {
      setIsSubmitting(true);
      setError("");
      try {
         await createTransaction(token, accountId, {
            txnType: operation,
            amount: values.amount,
            description: values.description,
            toAccountId: operation === "transfer" ? values.toAccountId : "",
         });
         const data = await getAccountTransactions(token, accountId);
         setAccount(data.account || data);
         setTransactions(data.transactions);
         setOperation(null);
      } catch (requestError) {
         if (requestError.message.includes("401")) {
            clearToken();
            navigate("/login");
            return;
         }
         setError(
            requestError instanceof Error
               ? requestError.message
               : "Unable to complete transaction.",
         );
      } finally {
         setIsSubmitting(false);
      }
   };

   if (error) {
      return (
         <section className="accounts-page">
            <p className="auth-message auth-error" role="alert">
               {error}
            </p>
         </section>
      );
   }

   if (!account) {
      return (
         <section className="accounts-page">
            <p>Loading account...</p>
         </section>
      );
   }

   const accountType =
      account.accountType || account.account_type || account.type || "Bank";
   const balance =
      account.balance === undefined ? "0.00" : Number(account.balance).toFixed(2);

   return (
      <section className="accounts-page">
         {operation ? (
            <div className="account-detail-card transaction-form-card">
               <button
                  className="account-close-button"
                  type="button"
                  aria-label="Close transaction form"
                  onClick={() => {
                     setOperation(null);
                     navigate(`/accounts/${accountId}`);
                  }}
               >
                  ×
               </button>
               <Form
                  formTitle={operation[0].toUpperCase() + operation.slice(1)}
                  formDescription={`Enter the details for your ${operation}.`}
                  formFields={[
                     {
                        inputType: "number",
                        inputLabel: "Amount",
                        name: "amount",
                        placeholder: "0.00",
                     },
                     {
                        inputType: "text",
                        inputLabel: "Description",
                        name: "description",
                     },
                     ...(operation === "transfer"
                        ? [
                             {
                                inputType: "select",
                                inputLabel: "To account",
                                name: "toAccountId",
                                options: otherAccounts.map((item) => ({
                                   value: item._id,
                                   label:
                                      item.accountType ||
                                      item.account_type ||
                                      item.type ||
                                      "Bank account",
                                })),
                             },
                          ]
                        : []),
                  ]}
                  submitLabel="Submit"
                  submitDisabled={isSubmitting}
                  onSubmit={handleTransaction}
               />
            </div>
         ) : null}
         {!operation && (
            <div className="account-actions">
               <button
                  className="secondary-btn"
                  type="button"
                  onClick={() => openOperation("deposit")}
               >
                  Deposit
               </button>
               <button
                  className="secondary-btn"
                  type="button"
                  onClick={() => openOperation("withdraw")}
               >
                  Withdraw
               </button>
               <button
                  className="secondary-btn"
                  type="button"
                  onClick={() => openOperation("transfer")}
               >
                  Transfer
               </button>
               <button className="secondary-btn account-close-action" type="button">
                  Close account
               </button>
            </div>
         )}
         {!operation && (
            <div className="account-detail-card account-info-card">
               <h1>{accountType} account</h1>
               <p>Account ID: {account._id}</p>
               <strong>${balance}</strong>
            </div>
         )}
         {!operation && (
            <div className="account-detail-card transaction-history-card">
               <div className="transaction-history">
                  <h2>Transaction history</h2>
                  {transactions.length === 0 ? (
                     <p>
                        No transactions yet. Make a transaction to see your history here.
                     </p>
                  ) : (
                     <div className="transaction-list">
                        {[...transactions].reverse().map((transaction, index) => (
                           <div
                              className="transaction-row"
                              key={transaction._id || transaction.id || index}
                           >
                              <span>
                                 {transaction.description ||
                                    transaction.type ||
                                    "Transaction"}
                              </span>
                              <div className="transaction-values">
                                 <span className="transaction-balance">
                                    Balance: ${Number(transaction.balanceAfter || 0).toFixed(2)}
                                 </span>
                                 <strong>
                                    ${Number(transaction.amount || 0).toFixed(2)}
                                 </strong>
                              </div>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            </div>
         )}
      </section>
   );
}

export default AccountDetails;
