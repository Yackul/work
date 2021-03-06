import React from 'react';
import {Link, Redirect} from "react-router-dom";
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
        pwerror: '',
        checked: false,
        authState: 'loading',
        rediHome: false
      };
  
      this.handlePassChange = this.handlePassChange.bind(this);
      this.handleUserChange = this.handleUserChange.bind(this);
      this.handleCheck = this.handleCheck.bind(this);
    }

    componentDidMount = async () => {
		document.body.style.background = "#F5F5DC";
      try {
        await Auth.currentAuthenticatedUser()
        this.setState({ authState: 1 })
      } catch (err) {
        this.setState({ authState: 'unauthorized' })
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
      
      if(!this.state.username && !this.state.password) {
        this.setState({
          error: 1,
          pwerror: 1
        });
      }
      else if(!this.state.username && this.state.password) {
        this.setState({
          error: 1,
          pwerror: -1
        });
      }
      else if(this.state.username && !this.state.password) {
        this.setState({
          error: -1,
          pwerror: 1
        });
      }
      else{ 
        const {username, password} = this.state
        try {
          await Auth.signIn({ username, password}) 
          this.setState({
            error:-1,
            pwerror: -1
          });   
          //return window.location = "/Home" 
          this.setState({rediHome: true})
        } catch (err) {
            this.setState({
              error: 0,
              pwerror: -1
            });
        }
      }
    }

    render() {
  
      return (
        <div className='grad1'>
        <div className="container">
            <div className ="imgcontainer">
              <img src = {logo} alt = "avatar" className="avatar"/>
            </div>
            { this.state.rediHome ? (<Redirect to="/"/>) : null  }
            <h2>Log In and Git Going!</h2>
            <label><b>Username</b></label>
            <br/>
            <input type="text" placeholder="Enter Username" value={this.state.username} onKeyPress={event => {
              if (event.key === "Enter") {
                this.signIn();}}} onChange={this.handleUserChange} />
            {this.state.error === 0 && 
            <div className="smll">Username/Password credentials not found</div>}
            {this.state.error === 1 && 
            <div className="smll">Username cannot be empty.</div>}
            <br/>
            <label><b>Password</b></label>
            <br/>
            <input type="password" placeholder="Enter Password" value={this.state.password} onKeyPress={event => {
              if (event.key === "Enter") {
                this.signIn();}}} onChange={this.handlePassChange} />
            {this.state.pwerror === 1 && 
            <div className="smll">Password cannot be empty.</div>}
            <br/>
            <input type ="submit" className="submit" onClick={this.signIn} value = "Login"/>
            <Link to='/Register'><input type="submit" className="submit" value="Register"/></Link><br></br>
            {/*<input type="checkbox" checked={this.state.checked} onChange={this.handleCheck}/>
            <label>Remember Me?</label>*/}
          <span className="psw"> <a href="/RecoverAccount">Forgot password?</a></span>
          </div>     
          </div>   
      );
    }
  }
  export default LoginPage
  