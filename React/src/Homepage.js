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
            isOpen: false,
            authState: 'loading',
            Uname: '',
            invLST: [],
            invULST: [],
            invNum: 0,
            CookieSave: ''
        };

        this.creInvButts = this.creInvButts.bind(this);
    }

    acceptInv = async (x, y) => {
        console.log("x= ",x, "y= ", y)
        await axios.put("https://www.4424081204.com:1111/invites/" + x, {
            ACCEPTED: 1,
        }, {headers: {accesstoken: this.state.CookieSave}})
        await axios.post("https://www.4424081204.com:1111/WORKS_ON_REVIEWS", {
            REVIDREF: x,
            UNameW: this.state.Uname
        }, {headers: {accesstoken: this.state.CookieSave}})
        return window.location = "/Home"
    }

    componentDidMount = async () => {
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
            console.log("err", err)
          this.setState({ authState: 'unauthorized' })
        }
        await axios.get("https://www.4424081204.com:1111/invites/" + this.state.Uname, {
            headers: {accesstoken: this.state.CookieSave}
        }).then(res => {    
            
            var hldLST = []
            var hldLST2 = []
            var c = 0
            for(var i = 0; i<res.data.length; i++){
              const x = i
              if(res.data[x].ACCEPTED == 0){
                hldLST[x] = res.data[x].IREVID
                hldLST2[x] = res.data[x].FUNAME
                c++
              }
            }
            this.setState({
              invLST: hldLST,
              invNum: c,
              invULST: hldLST2
            })
          })
      }

      

    
    creInvButts() {
        let list = this.state.invLST
        let list2 = this.state.invULST
        var dResult = {}
        list.forEach((key, i) => dResult[key] = list2[i])
        //console.log(dResult)
        const items = Object.entries(dResult).map(([key, value]) => <div key = {key}><input type='submit' className='submit' value={"Invite from " + value} onClick={() => this.acceptInv(key, value)}/><br></br></div>)
        
        return items
    }

    render() {

        const invites = this.creInvButts()

        switch (this.state.authState) {
            case ('loading'):
                return <h1>Loading</h1>
            case (1):
                return (
                    <div className='grad1'>
                        <NavBar/>
                        <br></br>
                        <h1>Welcome to Git Going {this.state.Uname}!</h1>
                        <br></br>
                        {this.state.invNum > 0 &&
                        <div>
                        <div className='smll'>You have been invited to {this.state.invNum} project(s)! Click to accept!</div><br></br>
                        {invites}
                        </div>
                        }
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