import { useAuth } from "../../context/useAuth";

function Header({ navigate }) {
   const { token, clearToken } = useAuth();

   const go = (e, to) => {
      e.preventDefault();
      if (navigate) navigate(to);
      else window.location.href = to;
   };

   const handleAuthAction = (event) => {
      if (token) {
         event.preventDefault();
         clearToken();
         navigate("/login");
         return;
      }

      go(event, "/login");
   };

   return (
      <nav className="navbar">
         <a className="logo" href="/" onClick={(e) => go(e, "/")}>
            SecureBank
         </a>

         <div className="nav-links">
            <a href="/features" onClick={(e) => go(e, "/features")}>Features</a>
            <a href="/about" onClick={(e) => go(e, "/about")}>About</a>
            {token && <a href="/accounts" onClick={(e) => go(e, "/accounts")}>Accounts</a>}
            <button className="login-btn" onClick={handleAuthAction}>
               {token ? "Logout" : "Login"}
            </button>
         </div>
      </nav>
   );
}

export default Header;
