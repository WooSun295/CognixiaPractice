function fieldName(label) {
   return label.toLowerCase().replace(/\s+/g, "-");
}

function Form({
   formTitle,
   formDescription,
   formFields,
   submitLabel = "Submit",
   submitDisabled = false,
   onSubmit,
   secondaryLabel,
   onSecondaryAction,
   secondaryAsLink = false,
}) {
   const handleSubmit = (event) => {
      event.preventDefault();
      const values = Object.fromEntries(new FormData(event.currentTarget));
      onSubmit(values);
   };

   return (
      <>
         <h1>{formTitle}</h1>
         <p>{formDescription}</p>
         <form className="hero-buttons auth-form" onSubmit={handleSubmit}>
            {formFields.map((field) => {
               const name = field.name || fieldName(field.inputLabel);
               return (
                  <label key={name} className="auth-field">
                     {field.inputLabel}
                     {field.inputType === "select" ? (
                        <select name={name} defaultValue={field.defaultValue} required={field.required !== false}>
                           {field.options?.map((option) => (
                              <option key={option.value} value={option.value}>
                                 {option.label}
                              </option>
                           ))}
                        </select>
                     ) : (
                        <input
                           type={field.inputType}
                           name={name}
                           defaultValue={field.defaultValue}
                           placeholder={field.placeholder}
                           required={field.required !== false}
                        />
                     )}
                  </label>
               );
            })}
            <button className="primary-btn" type="submit" disabled={submitDisabled}>{submitLabel}</button>
         </form>
         {secondaryLabel && onSecondaryAction && (
            secondaryAsLink ? (
               <a
                  className="form-link"
                  href="#"
                  onClick={(event) => {
                     event.preventDefault();
                     onSecondaryAction();
                  }}
               >
                  {secondaryLabel}
               </a>
            ) : (
               <button className="secondary-btn" type="button" onClick={onSecondaryAction}>
                  {secondaryLabel}
               </button>
            )
         )}
      </>
   );
}

export default Form;
