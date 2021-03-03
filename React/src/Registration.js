import React from 'react';
import './index.css';
import {Auth} from 'aws-amplify';
import axios from 'axios'

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
        error: -1,
        pwerror: -1,
        pw2error: -1,
        emerror:-1
      };
  
      this.handlePassChange = this.handlePassChange.bind(this);
      this.handleEmailChange = this.handleEmailChange.bind(this);
      this.handlePassChange2 = this.handlePassChange2.bind(this);
      this.handleUserChange = this.handleUserChange.bind(this);
      this.handleCodeChange = this.handleCodeChange.bind(this);
    }
    
    signUp = async () => {
      var pwpattern = new RegExp(/[A-Z]+/)
      var pwpattern2 = new RegExp(/[!@#$%^&*()]+/)
      if(!this.state.username){
        this.setState({
          error:1
        })
      }
      else{
        this.setState({
          error:-1
        })
      }
      if(!this.state.password){
        this.setState({
          pwerror:1
        })
      }
      else if(this.state.password.length < 8) {
        this.setState({
          pwerror: 3
        })
      }
      else if (!pwpattern.test(this.state.password)){
        this.setState({
          pwerror: 2
        })
      }
      else if (!pwpattern2.test(this.state.password)){
        this.setState({
          pwerror: 2
        })
      }
      else{
        this.setState({
          pwerror:-1
        })
      }
      if(!this.state.password2){
        this.setState({
          pw2error:1
        })
      }
      else{
        this.setState({
          pw2error:-1
        })
      }
      if(!this.state.email){
        this.setState({
          emerror:1
        })
      }
      else{
        var pattern = new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
        var res = pattern.test(this.state.email);
        if(res){
          this.setState({
            emerror:-1
          })
        }
        else{
          this.setState({
            emerror: 0
          })
        }
      }
      if(this.state.password !== this.state.password2){
        this.setState({
          pwerror:0,
          pw2error:0
        })
      }
      if(this.state.error === -1 && this.state.pwerror === -1 && this.state.pw2error === -1 && this.state.emerror === -1){
        const {username, password, email } = this.state
        try {
          await Auth.signUp({ username, password, attributes: {email}})
          this.setState({
            step: 1,
            error: -1,
            pwerror: -1,
            pw2error: -1,
            emerror: -1
          });
        } catch (err) {
          if(this.state.emerror === -1){
            this.setState({
              error: 0
            })
          }
          else{
            this.setState({
              emerror: 0
            })        
          }
        }
      }
    }

    confirmSignUp = async () => {
      const {username, code} = this.state
      try {
        await Auth.confirmSignUp(username, code)
        this.setState({step: 2})
      } catch (err) {
      }
    }

    resendSignUp = async () => {
      const{username} = this.state
      try{
        await Auth.resendSignUp(username)
      }catch(err){
        console.log(err);
      }
    }

    submitForm = async () => {
        await axios.post("https://www.4424081204.com:1111/USERS", {
          UName: this.state.username,
          UEmail: this.state.email
        }).then(function (res) {
          //console.log(res);
          //pretty sure .then and on can be removed
        })
      this.signUp()
    }

    redirect(){
      return window.location = "/"      
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
        <div className='grad1'>
        <div className="container">
       
          {this.state.step === 0 &&(
            <div>
              <h2>Register a new account</h2>
              <label><b>Account Details</b></label>
              <br></br>
              <input type="text" name="UEmail" id="UEmail" placeholder="Enter Email" data-test="email" value={this.state.email} onChange={this.handleEmailChange} />
              {this.state.emerror === 1 && 
              <div className="smll">Email cannot be empty.</div>}
              {this.state.emerror === 0 && 
              <div className="smll">Please enter a valid e-mail.</div>}
              <br></br>
              <input type="text" name="UName" id="UName" placeholder="Enter Username" data-test="username" value={this.state.username} onChange={this.handleUserChange} />
              {this.state.error === 1 && 
              <div className="smll">Username cannot be empty.</div>}
              {this.state.error === 0 && 
              <div className="smll">Username already in use.</div>}
              {this.state.error === 3 && 
              <div className="smll">Username too short.</div>}
              <br></br>
              <label><b>Password</b></label>
              <br></br>
              <div className = "requi"><b>Password Rules:</b><br></br><i> 1+ capital letter<br></br>1+ special character<br></br>(!@#$%^&*())</i><br></br></div>
              <br></br>
              <input type="password" name="UPW" id="UPW" placeholder="Enter Password" data-test="password" value={this.state.password} onChange={this.handlePassChange} />
              {this.state.pwerror === 1 && 
              <div className="smll">Passwords cannot be empty.</div>}
              {this.state.pwerror === 2 && 
              <div className="smll">Passwords must contain a capital letter and one special character.</div>}
              {this.state.pwerror === 0 && 
              <div className="smll">Passwords must match.</div>}
              {this.state.pwerror === 3 && 
              <div className="smll">Passwords must contain at least 8 characters.</div>}
              <br></br>
              <input type="password" placeholder="Re-enter Password" data-test="password" value={this.state.password2} onChange={this.handlePassChange2} />
              {this.state.pw2error === 1 && 
              <div className="smll">Passwords cannot be empty.</div>}
              {this.state.pw2error === 0 && 
              <div className="smll">Passwords must match.</div>}
              <br></br>
              <div>
              <input type = "hidden" name ="UName"  value = {this.state.username}/>
              <input type = "hidden" name ="UEmail"  value = {this.state.email}/>
              <input type="submit" className="submit" value="Create Account" onClick={this.submitForm}/>          
              </div>
              <p>Already have an account? <a href='/'>Sign In</a></p>
          </div>
          )
          }
          {
            this.state.step === 1 &&(
              <div>
                <h1>Please don't leave or refresh this page; registration may not be completed!</h1>
                <input type="text" name="UName" id="UName" placeholder="Enter Username" value={this.state.username} onChange={this.handleUserChange}/>
                <br></br>
                <input type="text" name="AuthCode" id="AuthCode" placeholder="Enter Authentication Code" value={this.state.code} onChange={this.handleCodeChange}/>
                <br></br>
                <input type="submit" className="submit" value="Validate Account" data-test="submit" onClick={this.confirmSignUp}/><br>
                </br>
                <div>Resend Verification E-mail</div>
                <input type="submit" className="submit" value="Resend"  onClick={this.resendSignUp}/>
              </div>
            )
          }
          {
            this.state.step === 2 &&(
              <div>
                <h2>Account succesfully created! Please log in to continue!</h2>
                <input type="submit" className="submit" value="Continue to Log In" data-test="submit" onClick={this.redirect}/>
              </div>
            )
          }
          </div>
      </div>      
    );
  }
}
export default RegisterPage