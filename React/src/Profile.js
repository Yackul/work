import React from 'react';
import './index.css';
import logo from './GitGoing.jpeg';

class ProfilePage extends React.Component {
    
  constructor(props) {
    super(props);
    this.state = {
      LoggedIn: localStorage.LoggedIn
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(evt) {
    evt.preventDefault();
    localStorage.LoggedIn = 'false'
    window.location = "/"
  }  
  
  render() {
    
    return (    
        
      <div> 
        <div className="pill-nav">
        <img src={logo} alt="avatar2" className="avatar2" />
            <a href="/Home">Home</a>
            <a href="/Me">My Profile</a>
            <a href="/MyProjects">My Projects</a>
          </div>
        <h2>Im a profile!</h2>
        <input type ="submit" className="submit" onClick={this.handleSubmit} value = "Sign Out"/>
           </div>
          
        
      );
    }
  }

  export default ProfilePage