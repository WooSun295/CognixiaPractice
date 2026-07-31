import Display_Card from "../display_card/Display_Card";
import AuthPrompt from "../modal/AuthPrompt";
import { useAuth } from "../../context/useAuth";
import { useState } from "react";

function Features({ navigate }) {
   const { token } = useAuth();
   const [showAuthPrompt, setShowAuthPrompt] = useState(false);
   const openAccount = () => {
      if (!token) setShowAuthPrompt(true);
   };

   return (
      <div className="landing-page features-page">
         <main className="hero">
            <div className="hero-content">
               <h1>Features</h1>

               <p>
                  Open and manage accounts quickly and securely. With SecureBank,
                  customers can open a Checking account for everyday spending and bill
                  payments, and a Savings account to grow funds with competitive interest
                  rates.
               </p>

               <div className="hero-buttons">
                  <button className="primary-btn" onClick={openAccount}>Open a Checking Account</button>
                  <button className="primary-btn" onClick={openAccount}>Open a Savings Account</button>
               </div>
            </div>

            <div className="hero-card">
               <div className="card-list">
                  <Display_Card title="Checking Account" headline="No monthly fees">
                     <p>
                        Fast deposits, debit card access, mobile check deposit, and easy
                        bill pay features built for everyday banking.
                     </p>
                  </Display_Card>

                  <Display_Card title="Savings Account" headline="Grow your savings">
                     <p>
                        Competitive rates, automatic transfers, and tools to help reach
                        your financial goals.
                     </p>
                  </Display_Card>
               </div>
            </div>
         </main>
         {showAuthPrompt && <AuthPrompt navigate={navigate} onClose={() => setShowAuthPrompt(false)} />}
      </div>
   );
}

export default Features;
