import React from "react";
import "./Header.css";

function Header() {
   return (
      <nav className="navbar">
         <a className="logo" href="/">
            SecureBank
         </a>

         <div className="nav-links">
            <a href="/features">Features</a>
            <a href="/about">About</a>
            <button className="login-btn">Login</button>
         </div>
      </nav>
   );
}

export default Header;
