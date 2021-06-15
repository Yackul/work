import React from 'react';
import './index.css';
import NavBar from './NavBar'
import { Auth } from 'aws-amplify'
import Cookies from 'js-cookie' 
import M_pic from './Michael_aboutus.jpg';
import T_pic from './Travis_Pic.png';
import C_pic from './Christina_pic.jpg';
import S_pic from './Sarah_pic.png';



class AboutUs extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            authState: 1,
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
          console.log("Just for Michael")
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
                        <img src={C_pic} alt="avatar3" className="avatar3" />   
                        <div className="boldtextAU">Christina Nguyen - Project Manager (Visual Design Lead)</div>
                        <p style={{color:"darkblue"}}>Statement from Christina:</p>      
                        <div style={{color:"darkcyan"}}>"As an ambitious computer science graduate, I aspire to pursue software development and close</div>
                        <div style={{color:"darkcyan"}}>the gender gap within the technology industry. Living as a disabled woman, I aim to utilize my</div>
                        <div style={{color:"darkcyan"}}>experiences and knowledge to push the boundaries and advocate for all women, especially those with</div>
                        <div style={{color:"darkcyan"}}>disabilities, and minorities - to help them go beyond their limits towards success."</div>
                        <p style={{color:"darkblue"}}>Christina may be reached at: christinavii85@gmail.com</p>
                        <br></br>                 
                        <br></br>                
                        <img src={M_pic} alt="avatar3" className="avatar3" />   
                        <div className="boldtextAU">Michael Bloomquist - Project Manager (Backend Solutions Lead)</div>
                        <p style={{color:"darkblue"}}>Statement from Michael:</p>      
                        <div style={{color:"darkcyan"}}>"As a developer, my interests lie in ensuring ethical sustainability for future generations. </div>
                        <div style={{color:"darkcyan"}}>My priorities are working on equitable solutions, including for the betterment of the environment, </div>
                        <div style={{color:"darkcyan"}}>those solutions which give users more agency to pursue their own ambitions, and those which allow  </div>
                        <div style={{color:"darkcyan"}}>collaboration across multiple markets to increase overall global sustainability"</div>
                        <p style={{color:"darkblue"}}>Michael may be reached at: michaelrbloomquist@gmail.com</p>
                        <br></br>   
                        <br></br>
                        <img src={S_pic} alt="avatar3" className="avatar3" />   
                        <div className="boldtextAU">Sarah Ramazani - Project Manager (DevOps Lead)</div>
                        <div style={{color:"darkblue"}}>Statement from Sarah:</div>      
                        <div style={{color:"darkcyan"}}>"As a black woman in STEM, I aim to inspire future generations of underrepresented minorities,</div>
                        <div style={{color:"darkcyan"}}>especially black women, to pursue STEM education and careers. After years of walking into rooms</div>
                        <div style={{color:"darkcyan"}}>and not finding those who match my race and gender, I realized that “one person” is enough to</div>
                        <div style={{color:"darkcyan"}}>change an entire community’s perspective by reducing stigma consciousness related to less</div>
                        <div style={{color:"darkcyan"}}>anticipated belonging. By using my knowledge and dedication in the technology industry, I will always</div>
                        <div style={{color:"darkcyan"}}>strive to remember that I can be that “one person” for those who will follow my path."</div>
                        <p style={{color:"darkblue"}}>Sarah may be reached at: sarahrams1@gmail.com</p>
                        <br></br>                  
                        <br></br>                
                        <img src={T_pic} alt="avatar3" className="avatar3" />   
                        <div className="boldtextAU">Travis Lamb - Project Manager (Frontend Architect Lead)</div>
                        <p style={{color:"darkblue"}}>Statement from Travis:</p>      
                        <div style={{color:"darkcyan"}}>"I was someone who fell through the cracks a bit in my youth, but managed to discover myself </div>
                        <div style={{color:"darkcyan"}}>through my return to college at the age of 25. This gives me a unique perspective on the development </div>
                        <div style={{color:"darkcyan"}}>cycle, and I believe it's reflected in my work as I meticulously apply standards and practices designed</div>
                        <div style={{color:"darkcyan"}}>to ensure maximum utility and security. This level of maturity is what I start with and grow from."</div>
                        <p style={{color:"darkblue"}}>Travis may be reached at: lambatravis@gmail.com</p>
                        <br></br>
                    </div>
                    
                );
            case ('unauthorized'):
                return window.location = "/LogIn"
            default:
                return null
        }
    }
}

export default AboutUs