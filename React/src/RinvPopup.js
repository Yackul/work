import React from "react";
 
const RPopup = (props) => {
    return (
      <div className = 'popup-box'>
        <div className = 'box'>
        <div>{props.message}</div>
        <button className = 'x' onClick={props.closeMe}>x</button>
      
      </div>
      </div>
    );
    }
 
export default RPopup;