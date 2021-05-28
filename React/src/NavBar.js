import React from "react";
import logo from './GitGoing.jpeg';
import { Auth } from 'aws-amplify'
import axios from 'axios';
import Cookies from 'js-cookie'


class NavBar extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            authState: 'loading',
            Uname: '',
            invLST: [],
            invULST: [],
            invName: [],
            invProjName: [],
            invDT: [],
            invRevName: [],
            invRevDT: [],
            invNum: 0,
            RinvLST: [],
            RinvULST: [],
            RinvNum: 0,
            rFidRefLST: [],
            CookieSave: '',
            Count: 0
        };

        this.creInvButts = this.creInvButts.bind(this);
        this.creRevInvButts = this.creRevInvButts.bind(this);
    }

    signOut = async () => {
        try {
            await Auth.signOut();
        } catch (error) {
            console.log('error signing out: ', error);
        }
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
        } 
        catch (err) {
            this.setState({ authState: 'unauthorized' })
        }
        await axios.get("https://www.4424081204.com:1111/invites/" + this.state.Uname, {
            headers: {accesstoken: this.state.CookieSave}
        }).then(res => {    
            var hldLST = []
            var hldLST2 = []
            var hldProjNames = []
            var hldDT = []
            var c = 0
            for(var i = 0; i<res.data.length; i++){
                const x = i
                if(res.data[x].ACCEPTED === 0){
                    hldDT[x] = res.data[x].DT 
                    hldProjNames[x] = res.data[x].ProjName
                    hldLST[x] = res.data[x].IREVID
                    hldLST2[x] = res.data[x].FUNAME
                    c++
                }
            }
            this.setState({
                invProjName: hldProjNames,
                invDT: hldDT,
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
              var hldLST5 = []
              var hldRevNames = []
              var hldRevDT = []
              var b = 0
              for(var i = 0; i<res2.data.length; i++){
                  const z = i
                  if(res2.data[z].ACCEPTED === 0){
                    hldRevDT[z] = res2.data[z].DT 
                    hldRevNames[z] = res2.data[z].FileName
                    hldLST3[z] = res2.data[z].PIDREF
                    hldLST4[z] = res2.data[z].RFUNAME
                    hldLST5[z] = res2.data[z].FIDREF
                    b++
                  }
              }
              this.setState({
                invRevName: hldRevNames,
                invRevDT: hldRevDT,
                RinvLST: hldLST3,
                RinvNum: b,
                RinvULST: hldLST4,
                rFidRefLST: hldLST5
              })
            })
            this.setState({
              Count: this.state.RinvNum + this.state.invNum
            })
        }

      creRevInvButts() {
        let list3 = this.state.RinvLST
        let list4 = this.state.RinvULST
        var dRResult = {}
        list3.forEach((key2, i2) => dRResult[key2] = list4[i2])
        var filtered3 = this.state.invRevName.filter(function (el) {
            return el != null;
          });
        var filtered4 = this.state.invRevDT.filter(function (el) {
            return el != null;
        });
        var filtered5 = this.state.rFidRefLST.filter(function (el) {
            return el!= null;
        })
        const Ritems = Object.entries(dRResult).map(([key2, value2], index) => <div style={{border: "solid #4ab3b3e1", borderRadius: "12px", marginTop: "2px", padding: "2px"}} key = {key2}><div>Invite to review: {filtered3[index]}</div><div>On: {filtered4[index]}</div><input type='submit' className='submit_Overlay' value={"Accept invite from " + value2} onClick={() => this.acceptRevInv(key2, filtered3[index], index, filtered5)}/><input type='submit' className='submit_Overlay' value={"Decline invite from " + value2} onClick={() => this.declineRevInv(key2, value2)}/><br></br></div>)
        return Ritems
    }
    
    creInvButts() {
        let list = this.state.invLST
        let list2 = this.state.invULST
        var dResult = {}
        list.forEach((key, i) => dResult[key] = list2[i])
        var filtered = this.state.invProjName.filter(function (el) {
            return el != null;
          });
        var filtered2 = this.state.invDT.filter(function (el) {
            return el != null;
        });
        const items = Object.entries(dResult).map(([key, value], index) => <div style={{border: "solid #4ab3b3e1", borderRadius: "12px", marginTop: "2px", padding: "2px"}} key = {key}><div >Invite to project: {filtered[index]}</div><div>On: {filtered2[index]}</div><input type='submit' className='submit_Overlay' value={"Accept invite from " + value} onClick={() => this.acceptInv(key, filtered[index])}/><input type='submit' className='submit_Overlay' value={"Decline invite from " + value} onClick={() => this.declineInv(key, value)}/><br></br></div>)
        return items
    }

    acceptInv = async (x, y) => {
      await axios.put("https://www.4424081204.com:1111/invites/" + x, {
          ACCEPTED: 1,
      }, {headers: {accesstoken: this.state.CookieSave, IUNAME: this.state.Uname}})
      await axios.post("https://www.4424081204.com:1111/WORKS_ON_PROJECTS", {
          PIDREF: x,
          UNameW: this.state.Uname,
          PName: y,
          PSTATUS: 1
      }, {headers: {accesstoken: this.state.CookieSave}})
      return window.location = "/Home"
    }

    declineInv = async (x, y) => {
        await axios.put("https://www.4424081204.com:1111/invites/" + x, {
            ACCEPTED: -1,
        }, {headers: {accesstoken: this.state.CookieSave, IUNAME: this.state.Uname}})
        return window.location = "/Home"
    }

    acceptRevInv = async (x, y, z, a) => {
        await axios.put("https://www.4424081204.com:1111/invite_to_rev/" + a[z], {
            ACCEPTED: 1,
        }, {headers: {accesstoken: this.state.CookieSave, RIUNAME: this.state.Uname}})
        return window.location = "/Projects/" + x + "/" + y
    }

    declineRevInv = async (x, y) => {
        await axios.put("https://www.4424081204.com:1111/invite_to_rev/" + x, {
            ACCEPTED: -1,
        }, {headers: {accesstoken: this.state.CookieSave, RIUNAME: this.state.Uname}})
        return window.location = "/Home"
    }

    on() {
      document.getElementById("overlay").style.display = "block";
    }
    
    off() {
      document.getElementById("overlay").style.display = "none";
    }

    render(){
        const invites = this.creInvButts()
        const Rinvites = this.creRevInvButts()

        return(
            <div className="navbar">
            <div className="pill-nav">
                <img src={logo} alt="avatar2" className="avatar2" />   
                <a onClick ={this.on} style={{fontWeight:"bold", color: "red", borderRadius: "100%"}}>{this.state.Count}</a>    
                <a href="/Home">Home</a>  
                <a href="/Me">My Profile</a>
                <a href="/Projects">My Projects</a>
                <a href="/Review">Review (Beta)</a>
                <a href='/' className="sign-out" onClick={this.signOut}>Sign Out</a>
                    {this.state.Count > 0 && 
                        <div id="overlay" onClick={this.off}>
                            <div id="text4"><b>Projects</b>{invites}</div>                      
                            <div id="text4"><b>Reviews</b>{Rinvites}</div>
                        </div>
                    }
                    {this.state.Count === 0 &&
                        <div id="overlay" onClick={this.off}>
                            <div id="text4">No Invites Found!{<br></br>}Join your peers projects to get invited to review a file today!</div>
                        </div>
                    }
                
            </div>
            </div>

        )
    }
}

export default NavBar