import React from 'react';
import './index.css';

class RegisterPage extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        username: '',
        email: '',
        password: '',
        password2: '',
        error: '',
      };
  
      this.handlePassChange = this.handlePassChange.bind(this);
      this.handleEmailChange = this.handleEmailChange.bind(this);
      this.handlePassChange2 = this.handlePassChange2.bind(this);
      this.handleUserChange = this.handleUserChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleSubmit(evt) {

      if (!this.state.username) {
        return this.setState({ error: 'Username is required' });
      }
      if (!this.state.email) {
        return this.setState({ error: 'Email is required' });
      }
      if (!this.state.password) {
        return this.setState({ error: 'Password is required' });
      }
      if(!(this.state.password === this.state.password2)){
        return this.setState({error: 'Passwords must match'});
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

    handleUserChange(evt) {
        this.setState({
        username: evt.target.value,
        });
    };

    handleEmailChange(evt){
      this.setState({
        email: evt.target.value,
      });
    }

    handlePassChange(evt) {
        this.setState({
        password: evt.target.value,
        });
    }

    handlePassChange2(evt) {
        this.setState({
        password2: evt.target.value,
        });
    }

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
          <form action="http://localhost:3002/USERS/" method="post">
          <h2>Register a new account</h2>
          <label><b>Account Details</b></label>
          <br></br>
          <input type="text" name="UEmail" id="UEmail" placeholder="Enter Email" data-test="email" value={this.state.email} onChange={this.handleEmailChange} />
          <br></br>
          <input type="text" name="UName" id="UName" placeholder="Enter Username" data-test="username" value={this.state.username} onChange={this.handleUserChange} />
          <br></br>
          <label><b>Password</b></label>
          <br></br>
          <input type="password" name="UPW" id="UPW" placeholder="Enter Password" data-test="password" value={this.state.password} onChange={this.handlePassChange} />
          <br></br>
          <input type="password" placeholder="Re-enter Password" data-test="password" value={this.state.password2} onChange={this.handlePassChange2} />
          <br></br>
          <input type="submit" className="submit2" value="Create Account" data-test="submit" onClick={this.handleSubmit}/>
          <p>Already have an account? <a href='/'>Sign In</a></p>
          </form>
        </form>
      </div>      
    );
  }
}
export default RegisterPage