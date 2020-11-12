import React from 'react';
import {Link } from "react-router-dom";
import './index.css';

class RegisterPage extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        username: '',
        password: '',
        error: '',
      };
  
      this.handlePassChange = this.handlePassChange.bind(this);
      this.handleUserChange = this.handleUserChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
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
    return this.setState({ error: '' });
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
          <h2>Register a new account</h2>
          <label><b>User Name</b></label>
          <br></br>
          <input type="text" placeholder="Enter Username" data-test="username" value={this.state.username} onChange={this.handleUserChange} />
          <br></br>
          <label><b>Password</b></label>
          <br></br>
          <input type="password" placeholder="Enter Password" data-test="password" value={this.state.password} onChange={this.handlePassChange} />
          <br></br>
          <input type="submit" class="submit2" value="Create Account" data-test="submit"/>
          <p>Already have an account? <a href='/'>Sign In</a></p>
        </form>
      </div>
      
    );
  }
}

export default RegisterPage
//ReactDOM.render(<RegisterPage />, document.getElementById("root"));
