import React from 'react';
import './index.css';
import NavBar from './NavBar'
import { Auth } from 'aws-amplify'
import axios from 'axios';
import Cookies from 'js-cookie'
import Popup from './invPopup'; 
import RPopup from './RinvPopup'; 


class Homepage extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            authState: 'loading',
            Uname: '',
            invLST: [],
            invULST: [],
            invNum: 0,
            RinvLST: [],
            RinvULST: [],
            RinvNum: 0,
            CookieSave: '',
            isOpen: false,
            isOpen2: false
        };

        this.creInvButts = this.creInvButts.bind(this);
        this.creRevInvButts = this.creRevInvButts.bind(this);
        
    }

    openPopup = () => {
        this.setState({
            isOpen: true
        });
    }
    closePopup = () => {
        this.setState({
            isOpen: false
        });
    }
    openPopup2 = () => {
        this.setState({
            isOpen2: true
        });
    }
    closePopup2 = () => {
        this.setState({
            isOpen2: false
        });
    }

    acceptInv = async (x, y) => {
        await axios.put("https://www.4424081204.com:1111/invites/" + x, {
            ACCEPTED: 1,
        }, {headers: {accesstoken: this.state.CookieSave, IUNAME: this.state.Uname}})
        await axios.post("https://www.4424081204.com:1111/WORKS_ON_PROJECTS", {
            REVIDREF: x,
            UNameW: this.state.Uname
        }, {headers: {accesstoken: this.state.CookieSave}})
        return window.location = "/Home"
    }

    declineInv = async (x, y) => {
        await axios.put("https://www.4424081204.com:1111/invites/" + x, {
            ACCEPTED: -1,
        }, {headers: {accesstoken: this.state.CookieSave, IUNAME: this.state.Uname}})
        return window.location = "/Home"
    }

    acceptRevInv = async (x, y) => {
        await axios.put("https://www.4424081204.com:1111/invite_to_rev/" + x, {
            ACCEPTED: 1,
        }, {headers: {accesstoken: this.state.CookieSave, RIUNAME: this.state.Uname}})
        return window.location = "/Projects/" + x
    }

    declineRevInv = async (x, y) => {
        await axios.put("https://www.4424081204.com:1111/invite_to_rev/" + x, {
            ACCEPTED: -1,
        }, {headers: {accesstoken: this.state.CookieSave, RIUNAME: this.state.Uname}})
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
          await axios.get("https://www.4424081204.com:1111/invite_to_rev/" + this.state.Uname, {
            headers: {accesstoken: this.state.CookieSave}
        }).then(res2 => {    
            
            var hldLST3 = []
            var hldLST4 = []
            var b = 0
            for(var i = 0; i<res2.data.length; i++){
              const z = i
              if(res2.data[z].ACCEPTED == 0){
                hldLST3[z] = res2.data[z].RIREVID
                hldLST4[z] = res2.data[z].RFUNAME
                b++
              }
            }
            this.setState({
              RinvLST: hldLST3,
              RinvNum: b,
              RinvULST: hldLST4
            })
          })
      }
    creRevInvButts() {
        let list3 = this.state.RinvLST
        let list4 = this.state.RinvULST
        var dRResult = {}
        list3.forEach((key2, i2) => dRResult[key2] = list4[i2])
        const Ritems = Object.entries(dRResult).map(([key2, value2]) => <div key = {key2}><p></p><input type='submit' className='submit' value={"Accept invite from " + value2} onClick={() => this.acceptRevInv(key2, value2)}/><input type='submit' className='submit' value={"Decline invite from " + value2} onClick={() => this.declineRevInv(key2, value2)}/><br></br></div>)
        return Ritems
    }
    
    creInvButts() {
        let list = this.state.invLST
        let list2 = this.state.invULST
        var dResult = {}
        list.forEach((key, i) => dResult[key] = list2[i])
        const items = Object.entries(dResult).map(([key, value]) => <div key = {key}><p></p><input type='submit' className='submit' value={"Accept invite from " + value} onClick={() => this.acceptInv(key, value)}/><input type='submit' className='submit' value={"Decline invite from " + value} onClick={() => this.declineInv(key, value)}/><br></br></div>)
        return items
    }

    render() {
        let popup = null;
        let popup2 = null;
        const invites = this.creInvButts()
        const Rinvites = this.creRevInvButts()
        if(this.state.isOpen){
            popup = (<Popup  message={invites} closeMe={this.closePopup}/>);
        }
        if(this.state.isOpen2){
            popup2 = (<RPopup  message={Rinvites} closeMe={this.closePopup2}/>);
        }

        switch (this.state.authState) {
            case ('loading'):
                return <h1>Loading</h1>
            case (1):
                return (
                    <div className='grad1'>
                        <NavBar/>
                        <br></br>
                        <h1 style={{paddingLeft: 20}}>Welcome to Git Going, {this.state.Uname}!</h1>
                        <br></br>
                        {this.state.invNum > 0 &&
                        <div>
                        <div className='smll'>You have been invited to {this.state.invNum} project(s)!</div><br></br>
                        <input type='submit' className='submit' value="View Project Invites" onClick={this.openPopup}
                        />
                        {popup}
                        </div>}
                        {this.state.RinvNum > 0 &&
                        <div>
                        <div className='smll'>You have been invited to {this.state.RinvNum} review(s)!</div><br></br>
                        <input type='submit' className='submit' value="View Review Invites" onClick={this.openPopup2}
                        />
                        {popup2}
                        </div>}
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