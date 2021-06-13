import React from 'react';
import './index.css';
import NavBar from './NavBar'
import { Auth } from 'aws-amplify'
import Cookies from 'js-cookie' 
import M_pic from './Michael_aboutus.jpg';
import T_pic from './Travis_Pic.png';



class AboutUs extends React.Component {

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
                        <div className = "grad1">
                            <h1>Meet the team behind Git Going!</h1>
                        </div>                        
                        <br></br>                
                        <img src={M_pic} alt="avatar3" className="avatar3" />   
                        <div className="boldtextAU">Michael Bloomquist - Project Manager (Backend Solutions)</div>
                        <p style={{color:"dark"}}>Statement from Michael:</p>      
                        <div style={{color:"darkcyan"}}>"As a developer, my interests lie in ensuring ethical sustainability for future generations. </div>
                        <div style={{color:"darkcyan"}}>My priorities are working on equitable solutions, including for the betterment of the environment, </div>
                        <div style={{color:"darkcyan"}}>those solutions which give users more agency to pursue their own ambitions, and those which allow  </div>
                        <div style={{color:"darkcyan"}}>collaboration across multiple markets to increase overall global sustainability"</div>
                        <p style={{color:"darkblue"}}>Michael may be reached at: michaelrbloomquist@gmail.com</p>
                        <br></br>                     
                        <br></br>                
                        <img src={T_pic} alt="avatar3" className="avatar3" />   
                        <div className="boldtextAU">Travis Lamb - Project Manager (Frontend Architect)</div>
                        <p style={{color:"dark"}}>Statement from Travis:</p>      
                        <div style={{color:"darkcyan"}}>"I was someone who fell through the cracks a bit in my youth, but managed to discover myself </div>
                        <div style={{color:"darkcyan"}}>through my return to college at the age of 25. This gives me a unique perspective on the development </div>
                        <div style={{color:"darkcyan"}}>cycle, and I believe it's reflected in my work as I meticulously apply standards and practices designed</div>
                        <div style={{color:"darkcyan"}}>to ensure maximum utility and security. This level of maturity is what I start with and grow from. "</div>
                        <p style={{color:"darkblue"}}>Travis may be reached at: lambatravis@gmail.com</p>
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

export default AboutUs