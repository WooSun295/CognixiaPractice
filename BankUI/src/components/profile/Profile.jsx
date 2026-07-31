import { useEffect, useState } from "react";
import {
   deactivateUser,
   getUserAccounts,
   TokenExpiredError,
   updateUserProfile,
} from "../../api/auth";
import { useAuth } from "../../context/useAuth";
import Form from "../form/Form";

function Profile({ navigate, user }) {
   const { token, clearToken } = useAuth();
   const [profile, setProfile] = useState(user || null);
   const [isLoading, setIsLoading] = useState(!user);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [error, setError] = useState("");
   const [successMessage, setSuccessMessage] = useState("");
   const [isDeleting, setIsDeleting] = useState(false);
   const [deleteError, setDeleteError] = useState("");
   const [deleteMessage, setDeleteMessage] = useState("");

   useEffect(() => {
      if (!token) {
         navigate("/login");
         return;
      }

      if (user) {
         setProfile(user);
         setIsLoading(false);
         return;
      }

      let isMounted = true;
      getUserAccounts(token)
         .then((data) => {
            if (isMounted) setProfile(data);
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
                  : "Unable to load your profile.",
            );
         })
         .finally(() => {
            if (isMounted) setIsLoading(false);
         });

      return () => {
         isMounted = false;
      };
   }, [clearToken, navigate, token, user]);

   useEffect(() => {
      if (!successMessage) return undefined;

      const timeoutId = window.setTimeout(() => {
         navigate("/accounts");
      }, 3000);

      return () => window.clearTimeout(timeoutId);
   }, [successMessage, navigate]);

   useEffect(() => {
      if (!deleteMessage) return undefined;

      const timeoutId = window.setTimeout(() => {
         clearToken();
         navigate("/");
      }, 3000);

      return () => window.clearTimeout(timeoutId);
   }, [deleteMessage, clearToken, navigate]);

   const handleSubmit = async (values) => {
      setError("");
      setSuccessMessage("");
      setIsSubmitting(true);

      try {
         const updated = await updateUserProfile(token, {
            name: values.name,
            email: values.email,
            password: values.password,
         });
         setProfile((current) => ({ ...current, ...updated }));
         setSuccessMessage("User has been updated.");
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
               : "Unable to update your profile.",
         );
      } finally {
         setIsSubmitting(false);
      }
   };

   const handleDeleteUser = async () => {
      const confirmed = window.confirm(
         "Are you sure you want to delete user",
      );
      if (!confirmed) return;

      setDeleteError("");
      setDeleteMessage("");
      setIsDeleting(true);

      try {
         const result = await deactivateUser(token);
         const accountsClosed = result?.accountsClosed ?? 0;
         setDeleteMessage(
            `user has been deleted. ${accountsClosed} account(s) related to the user have been closed.`,
         );
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
         setDeleteError(
            requestError instanceof Error
               ? requestError.message
               : "Unable to delete user.",
         );
      } finally {
         setIsDeleting(false);
      }
   };

   if (isLoading) {
      return (
         <section className="accounts-page">
            <p>Loading your profile...</p>
         </section>
      );
   }

   return (
      <section className="accounts-page">
         <div className="profile-page-header">
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

            <button
               type="button"
               className="delete-user-btn"
               onClick={handleDeleteUser}
               disabled={isDeleting}
            >
               {isDeleting ? "Deleting..." : "Delete User"}
            </button>
         </div>

         {deleteError && (
            <p className="auth-message auth-error" role="alert">
               {deleteError}
            </p>
         )}
         {deleteMessage && (
            <p className="auth-message auth-success" role="status">
               {deleteMessage}
            </p>
         )}

         <div className="account-detail-card account-info-card">
            <Form
               formTitle="Your profile"
               formDescription="Update your account information below."
               formFields={[
                  {
                     inputType: "text",
                     inputLabel: "Name",
                     name: "name",
                     defaultValue: profile?.name || "",
                  },
                  {
                     inputType: "email",
                     inputLabel: "Email",
                     name: "email",
                     defaultValue: profile?.email || "",
                  },
                  {
                     inputType: "password",
                     inputLabel: "New Password",
                     name: "password",
                     defaultValue: "",
                     required: false,
                  },
               ]}
               submitLabel="Save changes"
               submitDisabled={isSubmitting}
               onSubmit={handleSubmit}
            />
            {error && (
               <p className="auth-message auth-error" role="alert">
                  {error}
               </p>
            )}
            {successMessage && (
               <p className="auth-message auth-success" role="status">
                  {successMessage}
               </p>
            )}
         </div>
      </section>
   );
}

export default Profile;
