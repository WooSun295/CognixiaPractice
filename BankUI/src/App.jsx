import React, { useState, useEffect } from "react";
import "./App.css";

import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";

import Landing from "./components/landing/Landing";
import Features from "./components/Features";
import About from "./components/About";

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
   if (path === "/" || path === "/home") Page = <Landing />;
   else if (path === "/features") Page = <Features />;
   else if (path === "/about") Page = <About />;
   else Page = <Landing />;

   return (
      <div className="app-root">
         <Header navigate={navigate} />
         <main>{Page}</main>
         <Footer />
      </div>
   );
}

export default App;
