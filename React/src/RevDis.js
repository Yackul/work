import React from 'react';
import './App.css';
import './index.css';
import {Auth} from 'aws-amplify'
import axios from 'axios'
import NavBar from './NavBar'
import Cookies from 'js-cookie'
import Popup from './invPopup'
import DiffDisplay from "./DiffDisplay";

class RevDis extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            routePara: 0,
            revID: -1,
            curTime: new Date().toLocaleString(),
            gotRev: '',
            Uname: '',
            RevName: '',
            RevIDLST: [],
            iUserN: '',
            fname: '',
            step: -1,
            CookieSave: '',
            cHld: [],
            isOpen: false,
            fileContent: '',
            fileName: '',
            resu: -1,
            RevInv: 0
        };
        this.handleiUserNChange = this.handleiUserNChange.bind(this);
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

    handleiUserNChange(evt) {
        this.setState({
            iUserN: evt.target.value,
        });
    };

    getReview = async () => {
        if (!this.state.RevIDLST.includes(this.state.routePara)) {
            return window.location = "/Err404"
        } else if (this.state.RevIDLST.includes(this.state.routePara)) {
            this.setState({
                revID: this.state.routePara
            })
            const hld = this.state.routePara;
            var hld2 = ""
            await axios.get("https://www.4424081204.com:1111/REVIEW/" + hld, {
                headers: {accesstoken: this.state.CookieSave}
            }).then(res => {
                hld2 = res.data;
                hld2 = hld2.toString().split("$#BREAKBREAK")
                this.setState({
                    gotRev: <div>
                        <DiffDisplay
                                     isOpen={true}
                                     diffText={hld2[2]}>
                        </DiffDisplay>
                    </div>,
                    fname: hld2[1],
                    RevName: hld2[0]
                })
            })
        }
    }

    loadCollab = async () => {
        await axios.get("https://www.4424081204.com:1111/WORKS_ON_PROJECTS/", {
            headers: {accesstoken: this.state.CookieSave, test: this.state.routePara}
        }).then(res => {
            var tHld = []
            for (var i = 0; i < res.data.length; i++) {
              if(i == 0){
                tHld[i] = res.data[i].UNameW
              }
              else{
                tHld[i] = res.data[i].UNameW
              }
            }
            this.setState({
                cHld: tHld
            })
        })
    }

    invitingUser = async () => {
        this.setState({
            step: 1
        })
    }

    inviteUser = async () => {
        await axios.post("https://www.4424081204.com:1111/INVITES/", {
            IREVID: this.state.revID,
            IUNAME: this.state.iUserN,
            FUNAME: this.state.Uname,
            DT: this.state.curTime
        }, {headers: {accesstoken: this.state.CookieSave}})
        this.setState({
            step: 2
        })
    }

    inviteRevUser = async (iuName) => {
        await axios.get("https://www.4424081204.com:1111/INVITE_TO_REV/"+iuName, {
            headers: {accesstoken: this.state.CookieSave}
        }).then(res=> {    
            if((res.data[0] === undefined) === false){   
                console.log('here', res.data[0].ACCEPTED)
                this.setState({
                    resu:res.data[0].ACCEPTED,
                    RevInv: 2
                })
            }
        })
        if(this.state.resu < 0 || this.state.RevInv !== 2){
            await axios.post("https://www.4424081204.com:1111/INVITE_TO_REV/", {
            RIREVID: this.state.revID,
            RIUNAME: iuName,
            RFUNAME: this.state.Uname,
            DT: this.state.curTime
            }, {headers: {accesstoken: this.state.CookieSave}})
        }
        else{
            this.setState({
                RevInv: 1 
            })
        }
    }

    componentDidMount = async () => {
        const x = parseInt(this.props.match.params.id)
        this.setState({
            routePara: x
        })
        const tokens = await Auth.currentSession();
        const userName = tokens.getIdToken().payload['cognito:username'];
        var userNameHold = userName.charAt(0).toUpperCase() + userName.slice(1);
        document.cookie = "clientaccesstoken=" + tokens.getAccessToken().getJwtToken() + ';';
        const temp = Cookies.get('clientaccesstoken')
        this.setState({
            Uname: userNameHold,
            CookieSave: temp
        })
        try {
            await Auth.currentAuthenticatedUser()
            this.setState({authState: 1})
        } catch (err) {
            this.setState({authState: 'unauthorized'})
        }
        await axios.get("https://www.4424081204.com:1111/WORKS_ON_PROJECTS/" + this.state.Uname, {
            headers: {accesstoken: this.state.CookieSave}
        }).then(res => {
            this.setState({REVIDLST: res.data})
            var hldLST = []
            for (var i = 0; i < res.data.length; i++) {
                const x = i
                hldLST[x] = res.data[x].REVIDREF
            }
            this.setState({
                RevIDLST: hldLST
            })
            this.getReview()
        })
        this.loadCollab();
    }

    confirmDel = async () => {
        await axios.delete("https://www.4424081204.com:1111/WORKS_ON_PROJECTS/" + this.state.routePara, {
            headers: {accesstoken: this.state.CookieSave}
        })
        await axios.delete("https://www.4424081204.com:1111/INVITES/" + this.state.routePara, {
            headers: {accesstoken: this.state.CookieSave}
        })
        await axios.delete("https://www.4424081204.com:1111/REVIEW/" + this.state.routePara, {
            headers: {accesstoken: this.state.CookieSave}
        })
        return window.location = "/Projects"
    }

    updatingReview = async() => {
        this.setState({step: 3})
    }

    updateReview = async() => {
        await axios.put("https://www.4424081204.com:1111/REVIEW/" + this.state.revID, {
            CurrRev: this.state.fileContent,
            FName: this.state.fileName
        }, {headers: {accesstoken: this.state.CookieSave}})
        return window.location = "/Projects/" + this.state.routePara
    }

    setFile = async (e) => {
        e.preventDefault()
        const reader = new FileReader()
        reader.onload = async (e) => {
            const text = (e.target.result)
            this.setState({
                fileContent: text
            })
        };
        reader.readAsText(e.target.files[0])
        this.setState({
            fileName: e.target.files[0].name
        })
    }

    render() {

        let popup = null;
        if (this.state.isOpen) {
            popup = (<Popup
                message={<div><p>This is permanent, and cannot be reversed</p><input type='submit' className='submit'
                                                                                     value='Are you sure?'
                                                                                     onClick={this.confirmDel}/></div>}
                closeMe={this.closePopup}/>);
        }

        const items = this.state.cHld.map((item, i) => <div key={i}><input type='submit' className='submit2' value={item} onClick={()=>this.inviteRevUser(item)}/></div>)

        switch (this.state.authState) {
            case ('loading'):
                return <h1>Loading</h1>
            case (1):
                return (
                    <div className='grad1'>
                        <NavBar/>
                        <br></br>
                        <div className='inline'>
                            <div>Collaborators:{<div className='smll2'>(Click a user to invite them to review!)</div>}{items}</div>
                            {this.state.RevInv === 1 &&
                            <div className='smllTEST'>Review Invite already sent!</div>}
                            {this.state.RevInv === 2 &&
                            <div className='smllTEST'>Invite Sent!</div>}
                        </div>
                        <div className='container'>
                            <input type="submit" className='submit' value="Invite a User to Project"
                                   onClick={this.invitingUser}/>
                            <input type="submit" className='submit' value="Update File" onClick={this.updatingReview}/>
                            {this.state.step === 1 &&
                            <div>
                                <br></br>
                                <input type="text" placeholder="Enter a username" value={this.state.iUserN}
                                       onChange={this.handleiUserNChange}/>
                                <br></br>
                                <input type='submit' className='submit' value='Send Invite' onClick={this.inviteUser}/>
                            </div>
                            }
                            {this.state.step === 2 &&
                            <div className='smll'>Invitation sent to {this.state.iUserN}!</div>
                            }
                            {this.state.step === 3 &&
                            <div>
                                <input type="file" style={{}} onChange={(e) => this.setFile(e)}/>
                                <br></br>
                                <input type='submit' className='submit' value='Update Review' style={{alignSelf:"center"}} onClick={this.updateReview}/>
                            </div>
                            }
                        </div>
                        <div className='colors' style={{textAlign:"center", marginBottom:10}}>Current Review: {this.state.RevName}<br></br>File
                            Type: {this.state.fname.split('.').pop()}</div>
                        <div className='grad2'>
                            <p>{this.state.gotRev}</p>
                        </div>
                        <br></br>
                        <input type='submit' className='submit' value="Delete Review" onClick={this.openPopup}/>
                        {popup}
                    </div>
                );
            case ('unauthorized'):
                return window.location = "/"
            default:
                return null
        }
    }
}

export default RevDis;