import { useEffect } from "react";
import { useAuth } from "../../context/useAuth";
import AdminController from "./AdminController";

const ADMIN_LOGIN_PATH = "/admin/1029384756";

function AdminPortal({ navigate }) {
   const { token, clearToken } = useAuth();

   // Redirect to login whenever the token is absent or becomes expired.
   useEffect(() => {
      if (!token) {
         navigate(ADMIN_LOGIN_PATH);
      }
   }, [token, navigate]);

   if (!token) return null;

   const handleLogout = () => {
      clearToken();
      navigate(ADMIN_LOGIN_PATH);
   };

   return (
      <div className="landing-page admin-login-page">
         <main className="hero admin-console-hero">
            <AdminController onLogout={handleLogout} />
         </main>
      </div>
   );
}

export default AdminPortal;
