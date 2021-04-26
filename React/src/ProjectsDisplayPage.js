import React from 'react';
import './index.css';
import {Auth} from 'aws-amplify'
import axios from 'axios'
import NavBar from './NavBar'
import Cookies from 'js-cookie'
import Popup from './invPopup'
import DiffDisplay from "./DiffDisplay";

class ProjectsDisplayPage extends React.Component {

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
            resu: -2,
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

    getFiles = async () => {
        if (!this.state.RevIDLST.includes(this.state.routePara)) {
            return window.location = "/Err404"
        } else if (this.state.RevIDLST.includes(this.state.routePara)) {
            this.setState({
                revID: this.state.routePara
            })
            const PIDREF = this.state.routePara;
            var hld2 = ""
            await axios.get("https://www.4424081204.com:1111/FILES_IN_PROJ/" + PIDREF, {
                headers: {accesstoken: this.state.CookieSave}
            }).then(res => {
                console.log(res.data)
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
    /*await axios.post("https://www.4424081204.com:1111/FILES_IN_PROJ", {
        FNAME: this.state.fileName
      })*/

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
            this.setState({REVIDLST: res.data})
            var hldLST = []
            for (var i = 0; i < res.data.length; i++) {
                const x = i
                hldLST[x] = res.data[x].PIDREF
            }
            this.setState({
                RevIDLST: hldLST
            })
            //this.getReview()
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

    updateStep = async (e) => {
        e.preventDefault();
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
      }

    render() {


        let popup = null;
        if (this.state.isOpen) {
            popup = (<Popup
                message={<div><p>This is permanent, and cannot be reversed</p><input type='submit' className='submit' value='Are you sure?' onClick={this.confirmDel}/></div>}
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
                                <input type="submit" className="submit" value="Add file to project" onClick={this.updateStep}/>      
                                </div>
                            }
                            {this.state.step === 1 &&
                                <input type="file" onChange={(e) => this.setFile(e)} placeholder="Add a file" />      
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
                            </div>
                            <div className='inline'>
                                <div>Collaborators:{<div className='smll2'>(Click a user to invite them to review!)</div>}{items}</div>
                                {this.state.RevInv === 1 &&
                                <div className='smllTEST'>Review Invite already sent!</div>}
                                {this.state.RevInv === 2 &&
                                <div className='smllTEST'>Invite Sent!</div>}
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