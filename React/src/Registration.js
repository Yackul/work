import React from 'react';
import './index.css';
import {Auth} from 'aws-amplify';

class RegisterPage extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        username: '',
        email: '',
        password: '',
        password2: '',
        code: "",
        step: 0,
      };
  
      this.handlePassChange = this.handlePassChange.bind(this);
      this.handleEmailChange = this.handleEmailChange.bind(this);
      this.handlePassChange2 = this.handlePassChange2.bind(this);
      this.handleUserChange = this.handleUserChange.bind(this);
      this.handleCodeChange = this.handleCodeChange.bind(this);
    }

    signUp = async () => {
      const {username, password, email } = this.state
      try {
        await Auth.signUp({ username, password, attributes: {email}})
        console.log('Succesful Sign Up!')
        this.setState({step: 1})
      } catch (err) {console.log("error - you suck", err)}
    }

    confirmSignUp = async () => {
      const {username, code} = this.state
      try {
        await Auth.confirmSignUp(username, code)
        console.log('It worked!')
        this.setState({step: 2})
      } catch (err) {console.log("haha, you suck", err)}
    }

    redirect(){
      return window.location = "/Home"      
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

    handleCodeChange(evt) {
      this.setState({
        code: evt.target.value,
      });
    }

    render() {

        return (
        
        <div className="container">
       
          {this.state.step === 0 &&(
            <div>
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
              <input type="submit" className="submit" value="Create Account" data-test="submit" onClick={this.signUp}/>
              <p><a href = '/Home'>Signed Up?</a></p>          
              <p>Already have an account? <a href='/'>Sign In</a></p>
          </div>
          )
          }
          {
            this.state.step === 1 &&(
              <div>
                <input type="text" name="UName" id="UName" placeholder="Enter Username" value={this.state.username} onChange={this.handleUserChange}/>
                <br></br>
                <input type="text" name="AuthCode" id="AuthCode" placeholder="Enter Authentication Code" value={this.state.code} onChange={this.handleCodeChange}/>
                <br></br>
                <input type="submit" className="submit" value="Validate Account" data-test="submit" onClick={this.confirmSignUp}/>
              </div>
            )
          }
          {
            this.state.step === 2 &&(
              <div>
                <h2>Account Succesfully Created!</h2>
                <input type="submit" className="submit" value="Continue to Site" data-test="submit" onClick={this.redirect}/>
              </div>
            )
          }
      </div>      
    );
  }
}
export default RegisterPage