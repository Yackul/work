import React from 'react';
import {Link } from "react-router-dom";
import './index.css';
import NotificationSystem from 'react-notification-system';
import logo from './GitGoing.jpeg';


class HomePage extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        username: '',
        password: '',
        error: '',
      };
    }
    notificationSystem = React.createRef();
    addNotification = event => {
        event.preventDefault();
        const notification = this.notificationSystem.current;
        notification.addNotification({
            message: 'HOW ABOUT THEM APPLES?',
            level: 'success'
        });
    };
  
  
  
    
  
    render() {
      
      return (

        
        
        <div> <h2>do stufffffffffffffff</h2>
        <button onClick={this.addNotification}>Add notification</button>
        <NotificationSystem ref={this.notificationSystem} />
           <h1>hihihihihihih</h1></div>
          
        
      );
    }
  }

  export default HomePage