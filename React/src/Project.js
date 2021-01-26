import React from 'react';
import './index.css';
import logo from './GitGoing.jpeg';
import { Auth } from 'aws-amplify'

class ProjectPage extends React.Component {
    
  constructor(props) {
    super(props);
    this.state = {
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(evt) {
    evt.preventDefault();
  }  
  componentDidMount = async () => {
    console.log('componentDidMount called')
    try {
      await Auth.currentAuthenticatedUser()
      this.setState({ authState: 1 })
    } catch (err) {
      this.setState({ authState: 'unauthorized' })
    }
    console.log(this.state.authState)
}



    render() {

      switch(this.state.authState) {
          case('loading'):
              return <h1>Loading</h1>
          case(1):
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
          case('unauthorized'):
              return window.location = "/"
          default: 
              return null  
      }
    }
}

  
   
  

  export default ProjectPage