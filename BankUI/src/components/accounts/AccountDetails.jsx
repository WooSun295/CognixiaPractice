import { useEffect, useState } from "react";
import {
   closeAccount,
   createAccount,
   createTransaction,
   getAccountTransactions,
   getUserAccounts,
   TokenExpiredError,
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
   const [hasCheckedOtherAccounts, setHasCheckedOtherAccounts] = useState(false);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [isCreatingAccount, setIsCreatingAccount] = useState(false);
   const [creationSuccess, setCreationSuccess] = useState(false);
   const [isClosingAccount, setIsClosingAccount] = useState(false);
   const [closeSuccess, setCloseSuccess] = useState(false);

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
            if (requestError instanceof TokenExpiredError) {
               clearToken();
               navigate("/");
               return;
            }
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

   useEffect(() => {
      if (!creationSuccess) return undefined;

      const timeoutId = window.setTimeout(() => {
         navigate("/accounts");
      }, 3000);

      return () => window.clearTimeout(timeoutId);
   }, [creationSuccess, navigate]);

   useEffect(() => {
      if (!closeSuccess) return undefined;

      const timeoutId = window.setTimeout(() => {
         navigate("/accounts");
      }, 3000);

      return () => window.clearTimeout(timeoutId);
   }, [closeSuccess, navigate]);

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
         setOtherAccounts(accounts);
         setHasCheckedOtherAccounts(true);
         setOperation(nextOperation);
         navigate(`/accounts/${accountId}/transactions`);
      } catch (requestError) {
         if (requestError instanceof TokenExpiredError) {
            clearToken();
            navigate("/");
            return;
         }
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

   const closeOperation = () => {
      setOperation(null);
      navigate(`/accounts/${accountId}`);
   };

   const handleCreateOtherAccount = async (values) => {
      setError("");
      setIsCreatingAccount(true);

      try {
         await createAccount(token, missingAccountType, values);
         setOperation(null);
         setCreationSuccess(true);
      } catch (requestError) {
         if (requestError instanceof TokenExpiredError) {
            clearToken();
            navigate("/");
            return;
         }
         if (requestError.message.includes("401")) {
            clearToken();
            navigate("/login");
            return;
         }
         setError(
            requestError instanceof Error
               ? requestError.message
               : "Unable to create account.",
         );
      } finally {
         setIsCreatingAccount(false);
      }
   };

   const handleTransaction = async (values) => {
      const amount = Number.parseFloat(values.amount);
      if (!Number.isFinite(amount) || amount <= 0) {
         setError("Enter a valid transaction amount.");
         return;
      }

      setIsSubmitting(true);
      setError("");
      try {
         await createTransaction(token, accountId, {
            txnType: operation,
            amount,
            description: values.description,
            toAccountId: operation === "transfer" ? values.toAccountId : "",
         });
         const data = await getAccountTransactions(token, accountId);
         setAccount(data.account || data);
         setTransactions(data.transactions);
         setOperation(null);
      } catch (requestError) {
         if (requestError instanceof TokenExpiredError) {
            clearToken();
            navigate("/");
            return;
         }
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

   const handleCloseAccount = async () => {
      setError("");
      setIsClosingAccount(true);

      try {
         await closeAccount(token, accountId);
         setCloseSuccess(true);
      } catch (requestError) {
         if (requestError instanceof TokenExpiredError) {
            clearToken();
            navigate("/");
            return;
         }
         if (requestError.message.includes("401")) {
            clearToken();
            navigate("/login");
            return;
         }
         setError(
            requestError instanceof Error
               ? requestError.message
               : "Unable to close account.",
         );
      } finally {
         setIsClosingAccount(false);
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

   if (creationSuccess) {
      return (
         <section className="accounts-page">
            <div className="account-options account-success-card">
               <h2>Account created successfully</h2>
               <p>Your new account will appear here shortly.</p>
            </div>
         </section>
      );
   }

   if (closeSuccess) {
      return (
         <section className="accounts-page">
            <div className="account-options account-success-card">
               <h2>Account successfully closed</h2>
            </div>
         </section>
      );
   }

   const accountType =
      account.accountType || account.account_type || account.type || "Bank";
   const balance =
      account.balance === undefined ? "0.00" : Number(account.balance).toFixed(2);

   const missingAccountType = accountType.toLowerCase().includes("saving")
      ? "Checking"
      : "Savings";

   const needsAnotherAccountForTransfer =
      operation === "transfer" && hasCheckedOtherAccounts && otherAccounts.length === 0;

   return (
      <section className="accounts-page">
         {!operation && (
            <a
               className="back-to-accounts"
               href="/accounts"
               onClick={(event) => {
                  event.preventDefault();
                  navigate("/accounts");
               }}
            >
               ← Back to accounts
            </a>
         )}
         {operation ? (
            <div className="account-detail-card transaction-form-card">
               <button
                  className="account-close-button"
                  type="button"
                  aria-label="Close transaction form"
                  onClick={closeOperation}
               >
                  ×
               </button>
               {needsAnotherAccountForTransfer ? (
                  <Form
                     formTitle={`Create a ${missingAccountType} account`}
                     formDescription={`You need a ${missingAccountType.toLowerCase()} account before you can make a transfer. Would you like to open one?`}
                     formFields={[]}
                     submitLabel="Open"
                     submitDisabled={isCreatingAccount}
                     onSubmit={handleCreateOtherAccount}
                  />
               ) : (
               <Form
                  formTitle={operation[0].toUpperCase() + operation.slice(1)}
                  formDescription={`Enter the details for your ${operation}.`}
                  formFields={[
                     {
                        inputType: "number",
                        inputLabel: "Amount",
                        name: "amount",
                        placeholder: "0.00",
                        step: "0.01",
                        min: "0.01",
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
               )}
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
               <button
                  className="secondary-btn account-close-action"
                  type="button"
                  disabled={isClosingAccount}
                  onClick={handleCloseAccount}
               >
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
