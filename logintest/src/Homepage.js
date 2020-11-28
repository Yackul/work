import React from 'react';
import {Link } from "react-router-dom";
import './index.css';
import NotificationSystem from 'react-notification-system';
import logo from './GitGoing.jpeg';


class HomePage extends React.Component {
    notificationSystem = React.createRef();
    addNotification = event => {
        event.preventDefault();
        const notification = this.notificationSystem.current;
        notification.addNotification({
            message: 'HOW ABOUT THEM APPLES?',
            level: 'success'
        });
    };
    showFile = async (e) => {
        e.preventDefault()
        const reader = new FileReader()
        reader.onload = async (e) => {
          const text = (e.target.result)
          console.log(text)
          alert(text)
        };
        reader.readAsText(e.target.files[0])
      }
  
  
  
    
  
    render() {
      
      return (    
        
        <div> 
          <div className="pill-nav">
          <img src={logo} alt="avatar2" className="avatar2" />
          <a className="active" href="/Home">Home</a>
          <a href="/Me">My Profile</a>
          <a href="#contact">Contact</a>
          <a href="#about">About</a>
          </div>
        <h2>do stufffffffffffffff</h2>
        <h2>do stufffffffffffffff</h2>
        <h2>do stufffffffffffffff</h2>
        <h2>do stufffffffffffffff</h2>
        <h2>do stufffffffffffffff</h2>
        <h2>do stufffffffffffffff</h2>
        <h2>do stufffffffffffffff</h2>
        <h2>do stufffffffffffffff</h2>
        <h2>do stufffffffffffffff</h2>
        <h2>do stufffffffffffffff</h2>
        <h2>do stufffffffffffffff</h2>
        <h2>do stufffffffffffffff</h2>
        <h2>do stufffffffffffffff</h2>
        <h2>do stufffffffffffffff</h2>
        <h2>do stufffffffffffffff</h2>
        <h2>do stufffffffffffffff</h2>
        <h2>do stufffffffffffffff</h2>
        <h2>do stufffffffffffffff</h2>
        <button onClick={this.addNotification}>Add notification</button>
        <NotificationSystem ref={this.notificationSystem} />
           <h1>hihihihihihih</h1>
           <input type ="file" onChange={(e) => this.showFile(e)} />
           </div>
          
        
      );
    }
  }

  export default HomePage