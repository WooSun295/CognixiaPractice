import { useState } from "react";
import { useAuth } from "../../context/useAuth";
import { loginUser, registerUser } from "../../api/auth";
import Form from "../form/Form";

function AuthPage({ navigate, initialMode = "login" }) {
   const { setToken } = useAuth();
   const [mode, setMode] = useState(initialMode);
   const [error, setError] = useState("");
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [successMessage, setSuccessMessage] = useState("");
   const isLogin = mode === "login";

   const switchMode = (nextMode) => {
      setMode(nextMode);
      setError("");
      setSuccessMessage("");
      navigate(nextMode === "login" ? "/login" : "/register");
   };

   const handleSubmit = async (values) => {
      setError("");
      setSuccessMessage("");
      setIsSubmitting(true);

      try {
         if (isLogin) {
            const response = await loginUser({
               email: values["email-address"],
               password: values.password,
            });

            if (!response?.access_token) {
               throw new Error("Login succeeded without an access token.");
            }

            setToken(response.access_token);
            navigate("/accounts");
         } else {
            await registerUser({
               name: values.name,
               email: values["email-address"],
               password: values.password,
            });
            setSuccessMessage("Registration successful. You can now log in.");
            setMode("login");
            navigate("/login");
         }
      } catch (requestError) {
         setError(requestError instanceof Error ? requestError.message : "Unable to complete the request.");
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <div className="landing-page">
         <main className="hero auth-hero">
            <div className="auth-board">
               <Form
                  formTitle={isLogin ? "Login" : "Register"}
                  formDescription={
                     isLogin
                        ? "Sign in to securely manage your SecureBank account."
                        : "Create an account to securely manage your SecureBank finances."
                  }
                  formFields={[
                     ...(!isLogin ? [{ inputType: "text", inputLabel: "Name" }] : []),
                     { inputType: "email", inputLabel: "Email address" },
                     { inputType: "password", inputLabel: "Password" },
                  ]}
                  submitLabel={isSubmitting ? "Submitting..." : isLogin ? "Login" : "Register"}
                  submitDisabled={isSubmitting}
                  onSubmit={handleSubmit}
                  secondaryLabel={isLogin ? "Need an account? Register" : "Already have an account? Login"}
                  secondaryAsLink
                  onSecondaryAction={() => switchMode(isLogin ? "register" : "login")}
               />
               {error && <p className="auth-message auth-error" role="alert">{error}</p>}
               {successMessage && <p className="auth-message auth-success" role="status">{successMessage}</p>}
            </div>
         </main>
      </div>
   );
}

export default AuthPage;
