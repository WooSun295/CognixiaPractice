import { useState, useEffect, useCallback } from "react";
import "./App.css";

import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";

import Landing from "./components/landing/Landing";
import Features from "./components/features/Features";
import About from "./components/about/About";
import AuthPage from "./components/auth/AuthPage";
import Accounts from "./components/accounts/Accounts";
import AccountDetails from "./components/accounts/AccountDetails";
import Profile from "./components/profile/Profile";
import AdminLogin from "./components/admin/AdminLogin";
import AdminPortal from "./components/admin/AdminPortal";

const ADMIN_LOGIN_PATH = "/admin/1029384756";
const ADMIN_PORTAL_PATH = "/admin/1029384756/portal";

function App() {
   const [path, setPath] = useState(window.location.pathname);
   const [userProfile, setUserProfile] = useState(null);

   useEffect(() => {
      const onPop = () => setPath(window.location.pathname);
      window.addEventListener("popstate", onPop);
      return () => window.removeEventListener("popstate", onPop);
   }, []);

   const navigate = useCallback((to) => {
      if (window.location.pathname !== to) {
         window.history.pushState({}, "", to);
         setPath(to);
      }
   }, []);

   if (path === ADMIN_LOGIN_PATH) {
      return (
         <div className="app-root">
            <main>
               <AdminLogin navigate={navigate} />
            </main>
         </div>
      );
   }

   if (path === ADMIN_PORTAL_PATH) {
      return (
         <div className="app-root">
            <main>
               <AdminPortal navigate={navigate} />
            </main>
         </div>
      );
   }

   let Page;
   if (path === "/" || path === "/home") Page = <Landing navigate={navigate} />;
   else if (path === "/features") Page = <Features navigate={navigate} />;
   else if (path === "/about") Page = <About />;
   else if (path === "/login")
      Page = <AuthPage navigate={navigate} initialMode="login" />;
   else if (path === "/register")
      Page = <AuthPage navigate={navigate} initialMode="register" />;
   else if (path === "/accounts")
      Page = <Accounts navigate={navigate} onUserLoaded={setUserProfile} />;
   else if (path === "/profile")
      Page = <Profile navigate={navigate} user={userProfile} />;
   else if (path.startsWith("/accounts/")) {
      const accountPath = path.slice("/accounts/".length);
      const accountId = accountPath.split("/")[0];
      Page = <AccountDetails accountId={accountId} navigate={navigate} />;
   } else Page = <Landing navigate={navigate} />;

   return (
      <div className="app-root">
         <Header navigate={navigate} />
         <main>{Page}</main>
         <Footer />
      </div>
   );
}

export default App;
