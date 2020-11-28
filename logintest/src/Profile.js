import React from 'react';
import {Link } from "react-router-dom";
import './index.css';
import logo from './GitGoing.jpeg';


class ProfilePage extends React.Component {
    
  
    render() {
      
      return (    
        
        <div> 
          <div className="pill-nav">
          <img src={logo} alt="avatar2" className="avatar2" />
          <a  href="/Home">Home</a>
          <a className="active">My Profile</a>
          <a href="#contact">Contact</a>
          <a href="#about">About</a>
          </div>
        <h2>Im a profile!</h2>
           </div>
          
        
      );
    }
  }

  export default ProfilePage