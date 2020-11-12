import React from 'react';
import {Link } from "react-router-dom";
import './index.css';
import logo from './GitGoing.jpeg';



class LoginPage extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        username: '',
        password: '',
        error: '',
        checked: true
      };
  
      this.handlePassChange = this.handlePassChange.bind(this);
      this.handleUserChange = this.handleUserChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleCheck = this.handleCheck.bind(this);
    }
    componentDidMount() {
      if (localStorage.checkbox && localStorage.username !== "") {
          this.setState({
              isChecked: true,
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
      const { username, password, checked } = this.state
      if(checked && username !== "") {
        localStorage.username = username
        localStorage.password = password
        localStorage.checkbox = checked
      }
  
      return this.setState({ error: '' });
    }
    handleCheck(evt) {
      this.setState({
        checked: evt.target.checked
      });
    }
  
    handleUserChange(evt) {
      this.setState({
        username: evt.target.value,
      });
    };
  
    handlePassChange(evt) {
      this.setState({
        password: evt.target.value,
      });
    }
  
    render() {
      
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
              <img src = {logo} alt = "Avatar" class="avatar"/>
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
            <input type="submit" class="submit" value="Log In" data-test="submit"/>
            <Link to ='/Register'><input type="submit" class="submit" value="Register"/></Link><br></br>
            
          
          </form>
           
          <span class="psw">Forgot <a href="/#">password?</a></span>
          </div>
        
      );
    }
  }

  export default LoginPage
  //ReactDOM.render(<LoginPage />, document.getElementById("root"));
  