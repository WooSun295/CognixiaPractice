import "./App.css";

import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";

import Landing from "./components/landing/Landing";

function App() {
   return (
      <div className="app-root">
         <Header />
         <main>
            <Landing />
         </main>
         <Footer />
      </div>
   );
}

export default App;
