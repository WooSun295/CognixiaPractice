import "./landing/Landing.css";

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
               <div className="card">
                  <h3>Our Mission</h3>
                  <h1>Customer-focused banking</h1>
                  <div className="divider"></div>
                  <p>
                     Delivering secure and intuitive banking services to help individuals
                     and families achieve their financial goals.
                  </p>
               </div>
            </div>
         </main>
      </div>
   );
}

export default About;
