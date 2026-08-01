import React from "react";
import reactLogo from "../../assets/react.svg";

export default function Footer() {
   return (
      <footer className="site-footer">
         <div className="footer-inner">
            <a className="footer-brand" href="/" aria-label="Go to home">
               <img src={reactLogo} alt="Site logo" className="footer-logo" />
               <span className="sr-only">Home</span>
            </a>

            <div className="footer-content">© {new Date().getFullYear()} Sunwoo Lee</div>
         </div>
      </footer>
   );
}
