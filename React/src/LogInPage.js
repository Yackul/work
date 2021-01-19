import React from 'react';
import {Link} from "react-router-dom";
import './index.css';
import logo from './GitGoing.jpeg';
import {Auth} from 'aws-amplify';

<title>Git Going!</title>
class LoginPage extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        username: '',
        password: '',
        error: '',
        checked: false,
      };
  
      this.handlePassChange = this.handlePassChange.bind(this);
      this.handleUserChange = this.handleUserChange.bind(this);
      this.handleCheck = this.handleCheck.bind(this);
    }

    componentDidMount() {
      if (localStorage.checked && localStorage.username !== "") {
          this.setState({
              checked: true,
              username: localStorage.username,
              password: localStorage.password
        })
      }
    }  
  
    handleCheck(evt) {
      this.setState({
        checked: evt.target.checked
      });
    };
  
    handleUserChange(evt) {
      this.setState({
        username: evt.target.value,
      });
    };
  
    handlePassChange(evt) {
      this.setState({
        password: evt.target.value,
      });
    };    

    signIn = async () => {
      const {username, password} = this.state
      try {
        await Auth.signIn({ username, password})
        console.log('Succesful Sign In!')
        return window.location = "/Home" 
      } catch (err) {console.log("error - you suck", err)}
    }

    render() {
  
      return (
        
        <div className="container">
            <div className ="imgcontainer">
              <img src = {logo} alt = "avatar" className="avatar"/>
            </div>
            <h2>Log In and Git Going!</h2>
            <label><b>User Name</b></label>
            <br></br>
            <input type="text" placeholder="Enter Username" value={this.state.username} onChange={this.handleUserChange} />
            <br></br>
            <label><b>Password</b></label>
            <br></br>
            <input type="password" placeholder="Enter Password" value={this.state.password} onChange={this.handlePassChange} />
            <br></br>
            <input type ="submit" className="submit" onClick={this.signIn} value = "Log In"/>
            
            <Link to='/Register'><input type="submit" className="submit" value="Register"/></Link><br></br>
            <input type="checkbox" checked={this.state.checked} onChange={this.handleCheck}/>
            <label>Remember Me?</label>         
          <span className="psw">Forgot <a href="/#">password?</a></span>
          </div>        
      );
    }
  }
  export default LoginPage
  