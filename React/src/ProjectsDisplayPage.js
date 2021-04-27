import React from 'react';
import './index.css';
import {Auth} from 'aws-amplify'
import axios from 'axios'
import NavBar from './NavBar'
import Cookies from 'js-cookie'
import Popup from './invPopup'
import {Link} from "react-router-dom";
import DiffDisplay from "./DiffDisplay";

class ProjectsDisplayPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            routePara: 0,
            curTime: new Date().toLocaleString(),
            Uname: '',
            FIDLST: [],
            iUserN: '',
            step: -1,
            CookieSave: '',
            cHld: [],
            isOpen: false,
            fileContent: '',
            fileName: '',
            fileNames: []
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

    getFiles = async () => {
        if (!this.state.FIDLST.includes(this.state.routePara)) {
            return window.location = "/Err404"
        } else if (this.state.FIDLST.includes(this.state.routePara)) {
        
            const PIDREF = this.state.routePara;
            var temp = []
            await axios.get("https://www.4424081204.com:1111/FILES_IN_PROJ/" + PIDREF, {
                headers: {accesstoken: this.state.CookieSave, test: -1}
            }).then(res => {
                for (var i = 0; i < res.data.length; i++) {
                    temp[i] = res.data[i].FNAME
                }
                this.setState({
                    fileNames: temp
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

    invitingUser = async () => {
        this.setState({
            step: 3
        })
    }

    inviteUser = async () => {
        await axios.post("https://www.4424081204.com:1111/INVITES/", {
            IREVID: this.state.routePara,
            IUNAME: this.state.iUserN,
            FUNAME: this.state.Uname,
            DT: this.state.curTime,
            ProjName: this.state.RevName
        }, {headers: {accesstoken: this.state.CookieSave}})
        this.setState({
            step: 4
        })
    }

    componentDidMount = async () => {
        document.body.style.background = "#d0f0f0e1";
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
            this.setState({FIDLST: res.data})
            var hldLST = []
            for (var i = 0; i < res.data.length; i++) {
                const x = i
                hldLST[x] = res.data[x].PIDREF
            }
            this.setState({
                FIDLST: hldLST
            })
            this.getFiles()
        })
        this.loadCollab();
    }

    //NEEDS WORK TO DELETE A PROJECT, NOT JUST A FILE.
    /*confirmDel = async () => {
        await axios.delete("https://www.4424081204.com:1111/WORKS_ON_PROJECTS/" + this.state.routePara, {
            headers: {accesstoken: this.state.CookieSave}
        })
        await axios.delete("https://www.4424081204.com:1111/INVITES/" + this.state.routePara, {
            headers: {accesstoken: this.state.CookieSave}
        })
        await axios.delete("https://www.4424081204.com:1111/PROJECT/" + this.state.routePara, {
            headers: {accesstoken: this.state.CookieSave}
        })
        return window.location = "/Projects"
    }
    */


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

    //might want this to add files straight from project page
    /*setFile = async (e) => {
        e.preventDefault()

        let f1Content = ''
        let f2Content = ''
        await axios.get("https://www.4424081204.com:1111/REVIEW/" + this.state.revID, {
            headers: {accesstoken: this.state.CookieSave}
        }).then(res => {

            const reader = new FileReader()
            f1Content = res.data.toString().split("$#BREAKBREAK")
            reader.onload = async (e) => {
                f2Content = (e.target.result)
                await axios.post('https://www.4424081204.com/test', {
                    file1Content: f1Content,
                    file2Content: f2Content
                })
                    .then((response) => {
                        // alert(response.data)
                    }, (error) => {
                        console.log(error)
                        alert(error)
                    });
                this.setState({
                    fileContent: f2Content
                })
            };

            reader.readAsText(e.target.files[0])
            this.setState({
                fileName: e.target.files[0].name
            })
        })
    }
    */

    popDB = async () => {
         const fileType = this.state.fileName.toString().split('.')
        await axios.post("https://www.4424081204.com:1111/FILES_IN_PROJ", {      
          FNAME: this.state.fileName,
          FTYPE: fileType[fileType.length-1],
          FCONTENT: this.state.fileContent,
          DT: this.state.curTime,
          PIDREF: this.state.routePara
        }, {headers: {accesstoken: this.state.CookieSave}}).then(function (res) {
        })
        this.setState({
          step: 1
        });
        this.updateStep();
      }

    updateStep = async () => {
        if(this.state.step === -1){
          this.setState({
            step: 0
          });
        }
        else if(this.state.step === 0) {
          this.setState({
            step: 1
          })
        }
        else if (this.state.step === 1){
            this.setState({
                step: -1
            })
            return window.location = "/Projects/" + this.state.routePara
        }
      }

    createFileLinks() {
        const items = this.state.fileNames.map((item, i) =><Link key={i} to ={this.state.routePara + "/" + this.state.fileNames[i]}><input key = {i} type="submit" value={item}/></Link>)
        return items
    }

    render() {


        let popup = null;
        if (this.state.isOpen) {
            popup = (<Popup
                message={<div><p>This is permanent, and cannot be reversed</p><input type='submit' className='submit' value='Are you sure?' onClick={this.confirmDel}/></div>}
                closeMe={this.closePopup}/>);
        }

        const items = this.state.cHld.map((item, i) => <div key={i}><input type='submit' className='submit2' value={"noclick nowork"+item} onClick={()=>this.inviteRevUser(item)}/></div>)
        const fileLinks = this.createFileLinks()

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
                            {this.state.step === -1 &&
                                <div className = 'center'>
                                    <input type="submit" className="submit" value="Add a file to project" onClick={this.updateStep}/>    
                                </div>
                            }
                            {this.state.step === 0 &&
                                <div className='inline'>
                                <br></br>
                                <input type="file" onChange={(e) => this.setFile(e)}/>
                                <br></br>
                                <input type="submit" className="submit" value="Add file to project" onClick={this.popDB}/>      
                                </div>
                            }
                            {this.state.step === 1 &&
                                <Link to ={"/Projects/"+ this.state.routePara}><input type ="submit" className = "submit" value= "Return to project page?" onClick={this.updateStep}/></Link>    
                            }

                                <input type="submit" className='submit' value="Invite a User to Project"
                                       onClick={this.invitingUser}/>
                                {this.state.step === 3 &&
                                <div>
                                    <br></br>
                                    <input style={{width: 150}}type="text" placeholder="Enter a username" value={this.state.iUserN}
                                           onChange={this.handleiUserNChange}/>
                                    <br></br>
                                    <input type='submit' className='submit' value='Send Invite' onClick={this.inviteUser}/>
                                </div>
                                }
                                {this.state.step === 4 &&
                                <div className='smll'>Invitation sent to {this.state.iUserN}!</div>
                                }
                            
                            <div className='inline'>
                                <div>Collaborators:{items}</div>
                    
                            <br></br>
                            <div className="center">
                                <div>{fileLinks}</div>
                            </div>
                            </div>
                            </div>
                        </div>
                        
                        <br></br>
                        <input type='submit' className='submit' value="Delete Project(todo--NOCLICK)" onClick={this.openPopup}/>
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

export default ProjectsDisplayPage;