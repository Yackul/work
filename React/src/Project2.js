import React from 'react';
import './App.css';
import './index2.css';
import './index.css';
import logo from './GitGoing.jpeg';
import { Auth } from 'aws-amplify'
import axios from 'axios'

class Project2 extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      fileContent: '',
      curTime : new Date().toLocaleString(),
      gotRev: ''
    };

  }

  getReview = async (d) => {
      await axios.get("http://localhost:3002/REVIEW/6").then(res => {
      this.setState({gotRev: res.data})
    })
    
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

            <br></br>           
            <form action = "http://localhost:3002/REVIEW" method = "post">
            <input type = "hidden" name ="CurrRev"  value = {this.state.fileContent}/>
            <input type = "hidden" name ="REVNAME"  value = 'test'/>
            <input type = "hidden" name = "DT" value = {this.state.curTime}/>
            <input type="file" onChange={(e) => this.showFile(e)} />
            <input type="submit" className="submit" value="Create Review"/>        
            <p style={{whiteSpace: 'pre'}}>{this.state.fileContent}</p>
            </form>
                <input type="submit" className = "submit" value="Get Review!" onClick={this.getReview}/>
                <p style={{whiteSpace: 'pre'}}>{this.state.gotRev}</p>
            
            
            <br></br>   

          </div>
        );
      case ('unauthorized'):
        return window.location = "/"
      default:
        return null
    }
  }
}

export default Project2;