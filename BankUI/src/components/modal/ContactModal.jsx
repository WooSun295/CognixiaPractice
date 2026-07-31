function ContactModal({ onClose }) {
   return (
      <div className="modal-overlay" role="presentation" onClick={onClose}>
         <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="contact-title" onClick={(event) => event.stopPropagation()}>
            <h2 id="contact-title">Customer Service</h2>
            <p>Call us at <strong>123-456-7890</strong>.</p>
            <button className="secondary-btn" onClick={onClose}>Close</button>
         </div>
      </div>
   );
}

export default ContactModal;
