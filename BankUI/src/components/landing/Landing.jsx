import Display_Card from "../display_card/Display_Card";
import { useAuth } from "../../context/useAuth";

function Landing({ navigate }) {
   const { token } = useAuth();

   return (
      <div className="landing-page">
         <main className="hero">
            <div className="hero-content">
               <h1>Banking Made Simple.</h1>

               <p>
                  Securely manage your accounts, transfer funds, track spending, and take
                  control of your finances anytime, anywhere.
               </p>

               <div className="hero-buttons">
                  {token ? (
                     <button className="primary-btn" onClick={() => navigate("/accounts")}>
                        Go to Accounts
                     </button>
                  ) : (
                     <>
                        <button className="primary-btn" onClick={() => navigate("/login")}>
                           Get Started
                        </button>
                        <button className="secondary-btn" onClick={() => navigate("/features")}>
                           Learn More
                        </button>
                     </>
                  )}
               </div>
            </div>

            <div className="hero-card">
               <Display_Card title="Total Balance" headline="$24,685.40">
                  <div className="card-row">
                     <span>Checking</span>
                     <span>$8,250.15</span>
                  </div>

                  <div className="card-row">
                     <span>Savings</span>
                     <span>$16,435.25</span>
                  </div>
               </Display_Card>
            </div>
         </main>
      </div>
   );
}

export default Landing;
