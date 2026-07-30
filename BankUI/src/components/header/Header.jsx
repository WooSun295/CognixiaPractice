import React from "react";
import "./Header.css";

function Header({ navigate }) {
   const go = (e, to) => {
      e.preventDefault();
      if (navigate) navigate(to);
      else window.location.href = to;
   };

   return (
      <nav className="navbar">
         <a className="logo" href="/" onClick={(e) => go(e, "/")}>
            SecureBank
         </a>

         <div className="nav-links">
            <a href="/features" onClick={(e) => go(e, "/features")}>Features</a>
            <a href="/about" onClick={(e) => go(e, "/about")}>About</a>
            <button className="login-btn">Login</button>
         </div>
      </nav>
   );
}

export default Header;
