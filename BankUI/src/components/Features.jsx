import "./landing/Landing.css";

function Features() {
   return (
      <div className="landing-page">
         <main className="hero">
            <div className="hero-content">
               <h1>Features</h1>

               <p>
                  Open and manage accounts quickly and securely. With SecureBank, customers
                  can open a Checking account for everyday spending and bill payments, and a
                  Savings account to grow funds with competitive interest rates.
               </p>

               <div className="hero-buttons">
                  <button className="primary-btn">Open a Checking Account</button>
                  <button className="secondary-btn">Open a Savings Account</button>
               </div>
            </div>

            <div className="hero-card">
               <div className="card">
                  <h3>Checking Account</h3>
                  <h1>No monthly fees</h1>
                  <div className="divider"></div>
                  <p>
                     Fast deposits, debit card access, mobile check deposit, and easy
                     bill pay features built for everyday banking.
                  </p>

                  <div style={{ height: 18 }}></div>

                  <h3>Savings Account</h3>
                  <h1>Grow your savings</h1>
                  <div className="divider"></div>
                  <p>
                     Competitive rates, automatic transfers, and tools to help reach your
                     financial goals.
                  </p>
               </div>
            </div>
         </main>
      </div>
   );
}

export default Features;
