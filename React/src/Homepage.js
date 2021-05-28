import React from 'react';
import './index.css';
import NavBar from './NavBar'
import { Auth } from 'aws-amplify'
import axios from 'axios';
import Cookies from 'js-cookie' 


class Homepage extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            authState: 'loading',
            Uname: '',
            CookieSave: '',
        };
    }
    componentDidMount = async () => {
        document.body.style.background = "#d0f0f0e1";
        try {
          await Auth.currentAuthenticatedUser()
          const tokens = await Auth.currentSession();          
          const userName = tokens.getIdToken().payload['cognito:username'];
          var userNameHold = userName.charAt(0).toUpperCase() + userName.slice(1);
          document.cookie = "clientaccesstoken="+ tokens.getAccessToken().getJwtToken()+';';
          const temp = Cookies.get('clientaccesstoken')          
          this.setState({ authState: 1,
            Uname: userNameHold,
            CookieSave: temp
         })
        } catch (err) {
          this.setState({ authState: 'unauthorized' })
        }        
    }

    render() {

        switch (this.state.authState) {
            case ('loading'):
                return <h1>Loading</h1>
            case (1):
                return (
                    <div>
                        <div className='test2'><NavBar/></div>        
                        <br></br>
                        <br></br>
                        <br></br> 
                        <div className = "grad1">
                            <h1 style={{paddingLeft: 20}}>Welcome to Git Going, {this.state.Uname}!</h1>
                        </div>
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

export default Homepage