import React from 'react';
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
      fileContent: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  
  showFile = async (e) => {
    e.preventDefault()
    const reader = new FileReader()
    reader.onload = async (e) => { 
      const text = (e.target.result)
      console.log(text)
      this.setState({
        fileContent: text
      })
    };
    reader.readAsText(e.target.files[0])

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
              <a href="/Review">Review (Beta)</a>
            </div>
            <br></br>

            <button onClick={this.toggleModal}>
              Create a new project
            </button>

            <br></br>           
            <form action = "http://localhost:3002/REVIEW" method = "post">
            <input type = "hidden" name ="CurrRev"  value = {this.state.fileContent}/>
            <input type = "hidden" name ="REVNAME"  value = 'test'/>
            <input type="file" onChange={(e) => this.showFile(e)} />
            <input type="submit" className="submit" value="Create Review"/>        
            <p style={{whiteSpace: 'pre'}}>{this.state.fileContent}</p>
            </form>
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