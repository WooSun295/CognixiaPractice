function ConfirmModal({
   title,
   message,
   details,
   confirmLabel = "Confirm",
   cancelLabel = "Cancel",
   onConfirm,
   onCancel,
   isSubmitting = false,
}) {
   return (
      <div className="modal-overlay" role="presentation" onClick={onCancel}>
         <div
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
            onClick={(event) => event.stopPropagation()}
         >
            <h2 id="confirm-modal-title">{title}</h2>
            <p>{message}</p>
            {details && details.length > 0 && (
               <div className="confirm-modal-details">
                  {details.map((detail) => (
                     <div className="confirm-modal-detail-row" key={detail.label}>
                        <span className="confirm-modal-detail-label">{detail.label}</span>
                        <span className="confirm-modal-detail-value">{detail.value}</span>
                     </div>
                  ))}
               </div>
            )}
            <div className="modal-buttons">
               <button
                  className="primary-btn"
                  type="button"
                  disabled={isSubmitting}
                  onClick={onConfirm}
               >
                  {isSubmitting ? "Please wait..." : confirmLabel}
               </button>
               <button
                  className="secondary-btn"
                  type="button"
                  disabled={isSubmitting}
                  onClick={onCancel}
               >
                  {cancelLabel}
               </button>
            </div>
         </div>
      </div>
   );
}

export default ConfirmModal;
