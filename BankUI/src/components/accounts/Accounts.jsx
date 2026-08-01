import { useEffect, useState } from "react";
import { createAccount, getUserAccounts, TokenExpiredError } from "../../api/auth";
import { useAuth } from "../../context/useAuth";
import Form from "../form/Form";

function accountLabel(account) {
   return account.accountType + " Account";
}

function accountTypeOrder(account) {
   const type = (
      account.accountType ||
      account.account_type ||
      account.type ||
      ""
   ).toLowerCase();
   if (type.includes("checking")) return 0;
   if (type.includes("saving")) return 1;
   return 2;
}

function Accounts({ navigate, onUserLoaded }) {
   const { token, clearToken } = useAuth();
   const [userData, setUserData] = useState(null);
   const [error, setError] = useState("");
   const [isLoading, setIsLoading] = useState(true);
   const [accountType, setAccountType] = useState(null);
   const [isCreating, setIsCreating] = useState(false);
   const [creationSuccess, setCreationSuccess] = useState(false);

   useEffect(() => {
      let isMounted = true;

      if (!token) {
         navigate("/login");
         return () => {
            isMounted = false;
         };
      }

      getUserAccounts(token)
         .then((data) => {
            if (isMounted) {
               setUserData(data);
               onUserLoaded?.(data);
            }
         })
         .catch((requestError) => {
            if (!isMounted) return;
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
         })
         .finally(() => {
            if (isMounted) setIsLoading(false);
         });

      return () => {
         isMounted = false;
      };
   }, [clearToken, navigate, token, onUserLoaded]);

   useEffect(() => {
      if (!creationSuccess) return undefined;

      const timeoutId = window.setTimeout(async () => {
         try {
            const refreshedUserData = await getUserAccounts(token);
            setUserData(refreshedUserData);
            onUserLoaded?.(refreshedUserData);
            setCreationSuccess(false);
         } catch (requestError) {
            if (requestError instanceof TokenExpiredError) {
               clearToken();
               navigate("/");
               return;
            }
            setCreationSuccess(false);
            setError(
               requestError instanceof Error
                  ? requestError.message
                  : "Unable to load accounts.",
            );
         }
      }, 1000);

      return () => window.clearTimeout(timeoutId);
   }, [creationSuccess, token, clearToken, navigate, onUserLoaded]);

   const showCreationForm = (nextAccountType) => {
      setError("");
      setAccountType(nextAccountType);
   };

   const handleCreateAccount = async (values) => {
      setError("");
      setIsCreating(true);

      try {
         await createAccount(token, accountType, values);
         setAccountType(null);
         setCreationSuccess(true);
      } catch (requestError) {
         if (requestError instanceof TokenExpiredError) {
            clearToken();
            navigate("/");
            return;
         }
         setError(
            requestError instanceof Error
               ? requestError.message
               : "Unable to create account.",
         );
      } finally {
         setIsCreating(false);
      }
   };

   if (isLoading) {
      return (
         <section className="accounts-page">
            <p>Loading your accounts...</p>
         </section>
      );
   }

   if (error) {
      return (
         <section className="accounts-page">
            <p className="auth-message auth-error" role="alert">
               {error}
            </p>
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

   const accounts = userData?.accounts || [];
   const sortedAccounts = [...accounts].sort((left, right) => {
      const closedDiff =
         Number(left.status === "closed") - Number(right.status === "closed");
      if (closedDiff !== 0) return closedDiff;
      return accountTypeOrder(left) - accountTypeOrder(right);
   });

   return (
      <section className="accounts-page">
         <div className="accounts-header">
            <div>
               <h1>Your accounts</h1>
               <p>View and manage your SecureBank accounts.</p>
            </div>
         </div>

         {accountType ? (
            <div className="account-options account-creation">
               <button
                  className="account-close-button"
                  type="button"
                  aria-label="Close account creation form"
                  onClick={() => setAccountType(null)}
               >
                  ×
               </button>
               <Form
                  formTitle={`Create a ${accountType} account`}
                  formDescription={`Are you ready to open a new ${accountType} account?`}
                  formFields={[]}
                  submitLabel="Open"
                  submitDisabled={isCreating}
                  onSubmit={handleCreateAccount}
                  secondaryLabel={`Create a ${accountType === "checking" ? "savings" : "checking"} account instead`}
                  secondaryAsLink
                  onSecondaryAction={() =>
                     showCreationForm(accountType === "checking" ? "savings" : "checking")
                  }
               />
            </div>
         ) : accounts.length > 0 ? (
            <div className="accounts-list">
               {sortedAccounts.map((account) => {
                  const isClosed = account.status === "closed";
                  return (
                     <button
                        className={`account-card${isClosed ? " account-card-closed" : ""}`}
                        type="button"
                        key={account._id}
                        disabled={isClosed}
                        onClick={() => navigate(`/accounts/${account._id}`)}
                     >
                        <h2>{accountLabel(account)}</h2>
                        {account.balance !== undefined && (
                           <strong>${Number(account.balance).toFixed(2)}</strong>
                        )}
                     </button>
                  );
               })}
            </div>
         ) : (
            <div className="account-options">
               <h2>Open your first account</h2>
               <p>
                  Choose a checking account for everyday spending or a savings account for
                  your goals.
               </p>
               <div className="hero-buttons">
                  <button
                     className="primary-btn"
                     type="button"
                     onClick={() => showCreationForm("Checking")}
                  >
                     Create a new checking account
                  </button>
                  <button
                     className="secondary-btn"
                     type="button"
                     onClick={() => showCreationForm("Savings")}
                  >
                     Create a new savings account
                  </button>
               </div>
            </div>
         )}
      </section>
   );
}

export default Accounts;
