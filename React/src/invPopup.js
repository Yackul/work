import React from "react";
 
const Popup = (props) => {
    return (
      <div className = 'popup-box'>
        <div className = 'box'>
        <p>{props.message}</p>
        <button className = 'x' onClick={props.closeMe}>x</button>
      
      </div>
      </div>
    );
    }
 
export default Popup;