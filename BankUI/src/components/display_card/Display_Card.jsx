import React from "react";
function Display_Card({ title, headline, children }) {
   return (
      <div className="card">
         {title && <h3>{title}</h3>}
         {headline && <h1>{headline}</h1>}
         <div className="divider"></div>

         <div className="card-body">{children}</div>
      </div>
   );
}

export default Display_Card;
