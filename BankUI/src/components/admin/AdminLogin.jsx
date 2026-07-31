import { useState } from "react";
import { useAuth } from "../../context/useAuth";
import { loginUser } from "../../api/auth";
import Form from "../form/Form";

function AdminLogin() {
   const { setToken } = useAuth();
   const [error, setError] = useState("");
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [loggedIn, setLoggedIn] = useState(false);

   const handleSubmit = async (values) => {
      setError("");
      setIsSubmitting(true);

      try {
         const response = await loginUser({
            email: values["email-address"],
            password: values.password,
         });

         if (!response?.access_token) {
            throw new Error("Login succeeded without an access token.");
         }

         setToken(response.access_token);
         setLoggedIn(true);
      } catch (requestError) {
         setError(requestError instanceof Error ? requestError.message : "Unable to complete the request.");
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <div className="landing-page admin-login-page">
         <main className="hero auth-hero">
            <div className="auth-board">
               {loggedIn ? (
                  <>
                     <h1>Admin Login</h1>
                     <p>You have signed in successfully.</p>
                  </>
               ) : (
                  <Form
                     formTitle="Admin Login"
                     formDescription="Sign in with your administrator credentials."
                     formFields={[
                        { inputType: "email", inputLabel: "Email address" },
                        { inputType: "password", inputLabel: "Password" },
                     ]}
                     submitLabel={isSubmitting ? "Signing in..." : "Login"}
                     submitDisabled={isSubmitting}
                     onSubmit={handleSubmit}
                  />
               )}
               {error && <p className="auth-message auth-error" role="alert">{error}</p>}
            </div>
         </main>
      </div>
   );
}

export default AdminLogin;
