import React, { Component } from 'react';
import './App.css';
import './index2.css';
import './index.css';
import logo from './GitGoing.jpeg';
import LandingPage from './LandingPage';
import ProjectUpload from './ProjectUpload'
import { Auth } from 'aws-amplify'

class Project extends React.Component {

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

  toggleModal = () => {
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    switch (this.state.authState) {
      case ('loading'):
        return <h1>Loading</h1>
      case (1):
        return (
          <div>
            <div className="pill-nav">
              <img src={logo} alt="avatar2" className="avatar2" />
              <a href="/Home">Home</a>
              <a href="/Me">My Profile</a>
              <a href="/Projects">My Projects</a>
            </div>
            <br></br>

            <button onClick={this.toggleModal}>
              Create a new project
            </button>

            <br></br>


            <ProjectUpload show={this.state.isOpen}
              onClose={this.toggleModal}>
            </ProjectUpload>

            <div className="Project">
              <LandingPage />
            </div>

          </div>
        );
      case ('unauthorized'):
        return window.location = "/"
      default:
        return null
    }
  }
}

export default Project;
