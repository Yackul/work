import React from 'react';
import './index.css';
import NavBar from './NavBar'
import { Auth } from 'aws-amplify'
import Cookies from 'js-cookie' 
import TT from './Youtube'

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
        document.body.style.background = "#F5F5DC";
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
                            <h1>Welcome to Git Going, {this.state.Uname}!</h1>
                            <h2>How we did it</h2>
                        </div>
                        
                        <TT style={{innerWidth: "20px"}} embedId="EWjT-4eBZPs"/>                    
                    </div>
                );
            case ('unauthorized'):
                return (
                    <div>
                        <div className='test2'><NavBar/></div>        
                        <br></br>
                        <br></br>
                        <br></br> 
                        <div className = "grad1">
                            <h1>Welcome to Git Going!</h1>
                            <h2>How we did it</h2>
                        </div>
                        <br></br>    
                        <TT embedId="EWjT-4eBZPs"/>                    
                    </div>
                )
            default:
                return null
        }
    }
}

export default Homepage