import { useEffect, useState } from "react";
import { useAuth } from "../../context/useAuth";
import { loginUser } from "../../api/auth";
import Form from "../form/Form";

const ADMIN_PORTAL_PATH = "/admin/1029384756/portal";

function AdminLogin({ navigate }) {
   const { token, setToken } = useAuth();
   const [error, setError] = useState("");
   const [isSubmitting, setIsSubmitting] = useState(false);

   // If a valid token is already stored, go straight to the portal.
   useEffect(() => {
      if (token) {
         navigate(ADMIN_PORTAL_PATH);
      }
   }, [token, navigate]);

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
         // useEffect above will navigate once token is set.
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
               {error && <p className="auth-message auth-error" role="alert">{error}</p>}
            </div>
         </main>
      </div>
   );
}

export default AdminLogin;
