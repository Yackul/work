import React from 'react';
import './index.css';
import logo from './GitGoing.jpeg';

class ProjectPage extends React.Component {
    
  constructor(props) {
    super(props);
    this.state = {
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(evt) {
    evt.preventDefault();
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
        <h2>Im a project page!</h2>
        
           </div>
          
        
      );
    }
  }

  export default ProjectPage