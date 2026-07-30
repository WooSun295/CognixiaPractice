import "./About.css";
import Display_Card from "../display_card/Display_Card";

function About() {
   return (
      <div className="landing-page">
         <main className="hero">
            <div className="hero-content">
               <h1>About SecureBank</h1>

               <p>
                  SecureBank is committed to providing secure, simple, and accessible
                  banking solutions. Our team focuses on delivering reliable services with
                  professional customer support and modern digital tools to help customers
                  manage their finances with confidence.
               </p>

               <div className="hero-buttons">
                  <button className="primary-btn">Contact Us</button>
               </div>
            </div>

            <div className="hero-card">
               <Display_Card title="Our Mission" headline="Customer-focused banking">
                  <p>
                     Delivering secure and intuitive banking services to help individuals
                     and families achieve their financial goals.
                  </p>
               </Display_Card>
            </div>
         </main>
      </div>
   );
}

export default About;
