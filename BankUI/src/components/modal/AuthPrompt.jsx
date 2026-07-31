function AuthPrompt({ navigate, onClose }) {
   return (
      <div className="modal-overlay" role="presentation" onClick={onClose}>
         <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="auth-prompt-title" onClick={(event) => event.stopPropagation()}>
            <h2 id="auth-prompt-title">Sign in to continue</h2>
            <p>Please log in or register before opening an account.</p>
            <div className="modal-buttons">
               <button className="primary-btn" onClick={() => navigate("/login")}>Login</button>
               <button className="secondary-btn" onClick={() => navigate("/register")}>Register</button>
            </div>
         </div>
      </div>
   );
}

export default AuthPrompt;
