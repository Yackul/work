import React from 'react';
import {Link } from "react-router-dom";
import './index.css';
import logo from './GitGoing.jpeg';



<title>Git Going!</title>
class LoginPage extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        username: '',
        password: '',
        error: '',
        checked: false,
        LoggedIn: 'false'
      };
  
      this.handlePassChange = this.handlePassChange.bind(this);
      this.handleUserChange = this.handleUserChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
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

    handleSubmit(evt) {
      evt.preventDefault();
      if (!this.state.username) {
        return this.setState({ error: 'Username is required' });
      }
  
      if (!this.state.password) {
        return this.setState({ error: 'Password is required' });
      }
      if(this.state.username !== 'admin') {
        return this.setState({ error: 'Incorrect Username!'})
      }
      if(this.state.password !== 'admin') {
        return this.setState({ error: 'Incorrect Password!'})
      }
      this.setState({
        LoggedIn: 'true'  
      }, () => console.log(this.state.LoggedIn));

      const { username, password, checked} = this.state
      
      if(checked && username !== "") {
        localStorage.username = username
        localStorage.password = password
        localStorage.checked = checked
      }

      localStorage.LoggedIn = 'true'

      if(localStorage.LoggedIn === 'true') {
        return window.location = "/Home"
      }

      return this.setState({ error: '' });

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
  
    render() {
      if(localStorage.LoggedIn === 'true') {
        return window.location = "/Home"
      }
      
      return (
        <div className="container">
          <form onSubmit={this.handleSubmit}>
            {
              this.state.error &&
              <h3 data-test="error">
                {this.state.error}
              </h3>
            }
            <div className ="imgcontainer">
              <img src = {logo} alt = "avatar" className="avatar"/>
            </div>
            <h2>Log In and Git Going!</h2>
            <label><b>User Name</b></label>
            <br></br>
            <input type="text" placeholder="Enter Username" data-test="username" value={this.state.username} onChange={this.handleUserChange} />
            <br></br>
            <label><b>Password</b></label>
            <br></br>
            <input type="password" placeholder="Enter Password" data-test="password" value={this.state.password} onChange={this.handlePassChange} />
            <br></br>
            <input type ="submit" className="submit" onClick={this.handleSubmit} value = "Log In"/>
            
            <Link to='/Register'><input type="submit" className="submit" value="Register"/></Link><br></br>
            <input type="checkbox" checked={this.state.checked} onChange={this.handleCheck}/>
            <label>Remember Me?</label>
          </form>
           
          <span className="psw">Forgot <a href="/#">password?</a></span>
          </div>
        
      );
    }
  }

  export default LoginPage
  //ReactDOM.render(<LoginPage />, document.getElementById("root"));
  