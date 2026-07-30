import "./Landing.css";
import Display_Card from "../display_card/Display_Card";

function Landing() {
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
                  <button className="primary-btn">Get Started</button>
                  <button className="secondary-btn">Learn More</button>
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
