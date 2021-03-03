import React from 'react';
import './index.css';
import logo from './GitGoing.jpeg';
import { Auth } from 'aws-amplify'

class AccountRecovery extends React.Component {
    
  constructor(props) {
    super(props);
    this.state = {
        error: -1,
        pwerror:-1,
        emerror: -1,
        email: '',
        username: "",
        step: 0,
        code: "",
        pw: "",
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleCodeChange = this.handleCodeChange.bind(this);
    this.handlePassChange = this.handlePassChange.bind(this);
  }

  handleSubmit(evt) {
    evt.preventDefault();
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
  handleCodeChange(evt){
    this.setState({
      code: evt.target.value,
    });
  }
  handlePassChange(evt){
    this.setState({
      pw: evt.target.value,
    });
  }
  forgotPassword = async () => {
    const {username} = this.state
    try {
      await Auth.forgotPassword(username)
      this.setState({
        step: 1
      })
    } catch(err){
      console.log(err)
    }
  }

  forgotPasswordSubmit = async () => {
    const {username, code, pw} = this.state
    try {
      await Auth.forgotPasswordSubmit(username, code, pw)
      return window.location = "/"
    } catch(err){
      console.log("submit", err)
    }
  }

  render() {
    return (
        <div className='grad1'>
        <div className="container">
            <div className ="imgcontainer">
                <img src = {logo} alt = "avatar" className="avatar"/>
            </div>
            {/*<label><b>Email</b></label><br></br>
            <input type="text" placeholder="Enter E-Mail" value={this.state.email} onChange={this.handleEmailChange} /><br></br>*/}
            <label><b>Username</b></label><br></br>
            <input type="text" placeholder="Enter Username" value={this.state.username} onChange={this.handleUserChange} /><br></br>
            <label><b>Send Password Reset Code</b></label>
            <div className = 'smll'>Reset code sent to e-mail associated with account</div>
            <br></br>
            <input type ="submit" className="submit" onClick={this.forgotPassword} value = "Send Reset Email"/>
            {this.state.step === 1 &&
            <div>
            <input type="text" placeholder="Enter PW reset code" value={this.state.code} onChange={this.handleCodeChange} /><br></br>
            <input type="password" placeholder="Enter new password" value={this.state.pw} onChange={this.handlePassChange} /><br></br>
            <input type ="submit" className="submit" onClick={this.forgotPasswordSubmit} value = "Reset Password"/>
            </div>}
            </div>
        </div>
    );
  }
} 
  
export default AccountRecovery