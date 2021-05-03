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
            routeID: 0,
            revID: -1,
            curTime: new Date().toLocaleString(),
            gotRev: '',
            Uname: '',
            RevName: '',
            RevIDLST: [],
            fname: '',
            step: -1,
            CookieSave: '',
            cHld: [],
            isOpen: false,
            fileContent: '',
            fileName: '',
            diffContent: '',
            fileID: -1,
            resu: -2,
            RevInv: 0
        };
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

    getReview = async () => {
        if (!this.state.RevIDLST.includes(this.state.routeID)) {
            return window.location = "/Err404"
        } else if (this.state.RevIDLST.includes(this.state.routeID)) {
            this.setState({
                revID: this.state.routeID
            })
            const hld = this.state.routePara;
            await axios.get("https://www.4424081204.com:1111/FILES_IN_PROJ/" + hld, {
                headers: {accesstoken: this.state.CookieSave, test: 0, pidref: this.state.routeID}
            }).then(res => {
                if(res.data[0].FSTATUS < 0) {
                    return window.location = "/Err404"
                }
                this.setState({
                    fileID: res.data[0].FID
                })
            })
            await axios.get("https://www.4424081204.com:1111/FILES_IN_PROJ/" + hld, {
                headers: {accesstoken: this.state.CookieSave}
            }).then(res => {
                this.setState({
                    gotRev: <div>
                        <DiffDisplay
                                     FID={this.state.fileID}
                                     PID={this.state.routeID}
                                     isOpen={true}
                                     diffText={res.data}>
                        </DiffDisplay>
                    </div>,
                })
            })
        }
    }

    loadCollab = async () => {
        await axios.get("https://www.4424081204.com:1111/WORKS_ON_PROJECTS/", {
            headers: {accesstoken: this.state.CookieSave, test: this.state.routeID}
        }).then(res => {
            var tHld = []
            for (var i = 0; i < res.data.length; i++) {
              if(i === 0){
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

    loadReview = async () => {
        await axios.get("http://localhost:3002/DIFFS_ON_FILES/" + this.state.fileID, {
            headers: {accesstoken: this.state.CookieSave}
        }).then(res => {
            alert(res.data)
        })
    }
    
    inviteRevUser = async (iuName) => {
        await axios.get("https://www.4424081204.com:1111/INVITE_TO_REV/"+iuName, {
            headers: {accesstoken: this.state.CookieSave, RID: this.state.fileID}
        }).then(res=> {
            if((res.data[0] === undefined) === false){
                this.setState({
                    resu:res.data[0].ACCEPTED,
                    RevInv: 2
                })
            }
        })
        if(this.state.resu === -2){
            await axios.post("https://www.4424081204.com:1111/INVITE_TO_REV/", {
            FIDREF: this.state.fileID,
            RIUNAME: iuName,
            PIDREF: this.state.routeID,
            RFUNAME: this.state.Uname,
            DT: this.state.curTime,
            FileName: this.state.routePara
            }, {headers: {accesstoken: this.state.CookieSave}})
            this.setState({
                RevInv: 2
            })
        }
        else if(this.state.resu === -1 || this.state.resu === 0) {
            await axios.put("https://www.4424081204.com:1111/INVITE_TO_REV/"+this.state.revID, {
                DT: this.state.curTime,
                ACCEPTED: 0
                }, {headers: {accesstoken: this.state.CookieSave, RIUNAME: iuName}
            }).then(res=> {
                this.setState({
                    RevInv: 2
                })
            })
        }
        else{
            this.setState({
                RevInv: 1 
            })
        }
    }

    componentDidMount = async () => {
        document.body.style.background = "#d0f0f0e1";
        const y = parseInt(this.props.match.params.id)
        const x = this.props.match.params.id2
        this.setState({
            routePara: x,
            routeID: y
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
        await axios.get("https://www.4424081204.com:1111/FILES_IN_PROJ/" + this.state.routeID, {
            headers: {accesstoken: this.state.CookieSave, test: -1}
        }).then(res => {
            var hldLST = []
            for (var i = 0; i < res.data.length; i++) {
                const x = i
                hldLST[x] = res.data[x].PIDREF
            }
            this.setState({
                RevIDLST: hldLST
            })
        })
        await this.getReview()
        await this.loadCollab()
        await this.loadReview()
    }

    confirmDel = async () => {
        await axios.put("https://www.4424081204.com:1111/FILES_IN_PROJ/" + this.state.fileID, {
            FSTATUS: -1
        },  {headers: {accesstoken: this.state.CookieSave}
        }).then(res => {
            console.log(res)
            return window.location = "/Projects/"+ this.state.routeID
        })
        /*await axios.delete("https://www.4424081204.com:1111/INVITES/" + this.state.routePara, {
            headers: {accesstoken: this.state.CookieSave}
        })*/
    }

    updatingReview = async() => {
        this.setState({step: 3})
    }

    createReview = async(e) => {

        e.preventDefault()

        let f1Content = ''
        let f2Content = this.state.fileContent

        await axios.get("https://www.4424081204.com:1111/FILES_IN_PROJ/" + this.state.fileID, {
            headers: {accesstoken: this.state.CookieSave, test: 2}
        }).then(res => {
            f1Content = res.data
        })
        await axios.post('https://www.4424081204.com/file_diff', {
            file1Content: f1Content,
            file2Content: f2Content
        }).then( diffRes => {
            this.setState({
                diffContent: diffRes.data
            })
        })
        await axios.get("https://www.4424081204.com:1111/FILES_IN_PROJ/" + this.state.fileID, {
            headers: {accesstoken: this.state.CookieSave, test: 1}
        }).then(async sqlRes => {
            await axios.post("https://www.4424081204.com:1111/DIFFS_ON_FILES/", {
                FIDREF: sqlRes.data[0].FID,
                CommDT: this.state.curTime,
                CommDiff: this.state.diffContent,
                CREATEDBY: this.state.Uname,
                APPROVED: 0
            }, {headers: {accesstoken: this.state.CookieSave}})
        })

        // await axios.put("https://www.4424081204.com:1111/FILES_IN_PROJ/" + this.state.fileID, {
        //     FCONTENT: this.state.fileContent,
        //     FNAME: this.state.fileName,
        //     FTYPE: this.state.fileName.split(".").pop()
        // }, {headers: {accesstoken: this.state.CookieSave}})
        // this.setState({ step: -1
        // })
        
    }

    setFile = async (e) => {
        e.preventDefault()

        const reader = new FileReader()
        reader.readAsText(e.target.files[0])
        reader.onload = async (e) => {
            this.setState({
                fileContent: e.target.result
            })
        }

        this.setState({
            fileName: e.target.files[0].name,
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
                        <div style={{display: 'flex', marginLeft:'auto', marginRight:20}}>
                            <div className='container'>
                                <input type="submit" className='submit' value="Update File" onClick={this.updatingReview}/>
                                {this.state.step === 3 &&
                                <div>
                                    <input type="file" style={{}} onChange={(e) => this.setFile(e)}/>
                                    <br></br>
                                    <input type='submit' className='submit' value='Create Review' style={{alignSelf:"center"}} onClick={this.createReview}/>
                                </div>
                                }
                            </div>
                            <div className='inline'>
                                <div>Collaborators:{<div className='smll2'>(Click a user to invite them to review!)</div>}{items}</div>
                                {this.state.RevInv === 1 &&
                                <div className='smllTEST'>Review Invite already sent!</div>}
                                {this.state.RevInv === 2 &&
                                <div className='smllTEST'>Invite Sent!</div>}
                            </div>
                        </div>
                        <div className='colors' style={{textAlign:"center", marginBottom:10}}>Current Review: {this.state.routePara}<br></br>File
                            Type: {this.state.routePara.split('.').pop()}</div>
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