import { useState } from "react";

function CreateUserModal({ onCreate, onCancel, isSubmitting = false, error }) {
   const [values, setValues] = useState({
      name: "",
      password: "",
      email: "",
      status: "active",
      auth: "user",
   });

   const handleChange = (field, value) => {
      setValues((previous) => ({ ...previous, [field]: value }));
   };

   const handleSubmit = (event) => {
      event.preventDefault();
      onCreate(values);
   };

   return (
      <div className="modal-overlay" role="presentation" onClick={onCancel}>
         <div
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-user-modal-title"
            onClick={(event) => event.stopPropagation()}
         >
            <button
               type="button"
               className="modal-close-btn"
               aria-label="Close"
               title="Close"
               onClick={onCancel}
            >
               ✕
            </button>
            <h2 id="create-user-modal-title">Create user</h2>
            <form className="hero-buttons auth-form" onSubmit={handleSubmit}>
               <label className="auth-field">
                  Name
                  <input
                     type="text"
                     value={values.name}
                     onChange={(event) => handleChange("name", event.target.value)}
                     required
                  />
               </label>
               <label className="auth-field">
                  Password
                  <input
                     type="password"
                     value={values.password}
                     onChange={(event) => handleChange("password", event.target.value)}
                     required
                  />
               </label>
               <label className="auth-field">
                  Email
                  <input
                     type="email"
                     value={values.email}
                     onChange={(event) => handleChange("email", event.target.value)}
                     required
                  />
               </label>
               <label className="auth-field">
                  Status
                  <input
                     type="text"
                     value={values.status}
                     onChange={(event) => handleChange("status", event.target.value)}
                     required
                  />
               </label>
               <label className="auth-field">
                  Auth
                  <input
                     type="text"
                     value={values.auth}
                     onChange={(event) => handleChange("auth", event.target.value)}
                     required
                  />
               </label>
               {error && (
                  <p className="auth-message auth-error" role="alert">
                     {error}
                  </p>
               )}
               <div className="modal-buttons">
                  <button className="primary-btn" type="submit" disabled={isSubmitting}>
                     {isSubmitting ? "Creating..." : "Create user"}
                  </button>
                  <button
                     className="secondary-btn"
                     type="button"
                     disabled={isSubmitting}
                     onClick={onCancel}
                  >
                     Cancel
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
}

export default CreateUserModal;
