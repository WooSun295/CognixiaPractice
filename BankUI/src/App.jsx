import { useState, useEffect } from "react";
import "./App.css";

import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";

import Landing from "./components/landing/Landing";
import Features from "./components/features/Features";
import About from "./components/about/About";
import AuthPage from "./components/auth/AuthPage";
import Accounts from "./components/accounts/Accounts";
import AccountDetails from "./components/accounts/AccountDetails";

function App() {
   const [path, setPath] = useState(window.location.pathname);

   useEffect(() => {
      const onPop = () => setPath(window.location.pathname);
      window.addEventListener("popstate", onPop);
      return () => window.removeEventListener("popstate", onPop);
   }, []);

   const navigate = (to) => {
      if (window.location.pathname !== to) {
         window.history.pushState({}, "", to);
         setPath(to);
      }
   };

   let Page = null;
   if (path === "/" || path === "/home") Page = <Landing navigate={navigate} />;
   else if (path === "/features") Page = <Features navigate={navigate} />;
   else if (path === "/about") Page = <About />;
   else if (path === "/login") Page = <AuthPage navigate={navigate} initialMode="login" />;
   else if (path === "/register") Page = <AuthPage navigate={navigate} initialMode="register" />;
   else if (path === "/accounts") Page = <Accounts navigate={navigate} />;
   else if (path.startsWith("/accounts/")) {
      const accountPath = path.slice("/accounts/".length);
      const accountId = accountPath.split("/")[0];
      Page = <AccountDetails accountId={accountId} navigate={navigate} />;
   }
   else Page = <Landing navigate={navigate} />;

   return (
      <div className="app-root">
         <Header navigate={navigate} />
         <main>{Page}</main>
         <Footer />
      </div>
   );
}

export default App;
