import React from 'react';
import './App.css';
import './index.css';
import {Auth} from 'aws-amplify'
import axios from 'axios'
import NavBar from './NavBar'
import Cookies from 'js-cookie'
import Popup from './invPopup'
import DiffDisplay from "./DiffDisplay";
import {Link} from "react-router-dom";

class RevDis extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            routePara: 0,
            routeID: 0,
            curTime: new Date().toLocaleString(),
            gotRev: '',
            Uname: '',
            RevName: '',
            list_file_ids: [],
            step: -1,
            CookieSave: '',
            cHld: [],
            isOpen: false,
            fileContent: '',
            fileName: '',
            diffContent: '',
            fileID: -1,
            resu: -2,
            RevInv: 0,
            revContent: '',
            isReview: -1,
            error: -1
        };
    }

    //these are manager functions for toggling the display of the pop-up component
    //true = open, false = close.
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

    //this is called at the tail end of componentDidMount so it's rendered on page load
    //it first checks to make sure the user is on a valid page(by seeing if the routeID exists in the list list_file_ids, which
    //contains all of the projectIDs the user is included in).
    //then if that's valid, it checks to see if the file has been deleted. if so, it returns 404.
    //if the file hasn't been deleted, it pulls the contents of the file and stores it in
    //the stateful variable gotRev
    getReview = async () => {
        if (!this.state.list_file_ids.includes(this.state.routeID)) {
            return window.location = "/Err404"
        } else if (this.state.list_file_ids.includes(this.state.routeID)) {
            const hld = this.state.routePara;
            await axios.get("https://www.4424081204.com:1111/FILES_IN_PROJ/" + hld, {
                headers: {accesstoken: this.state.CookieSave, test: 0, pidref: this.state.routeID}
            }).then(res => {
                if (res.data[0] === undefined) {
                    return window.location = "/Err404"
                }
                else if(res.data[0].FSTATUS < 0){
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
                    gotRev: <div style={{whiteSpace: 'pre-wrap'}}>
                        {res.data}
                    </div>,
                })
            })
        }
    }

    //this function is called in componentDidMount to render on page load
    //this checks to see if any other user is working on this project
    //and if so, it saves them to a list, cHld.

    //idk why it's an if/else in the for loop, statements are the same
    //may need clean-up 
    //TLamb -- 10/05/2021

    loadCollab = async () => {
        await axios.get("https://www.4424081204.com:1111/WORKS_ON_PROJECTS/", {
            headers: {accesstoken: this.state.CookieSave, test: this.state.routeID}
        }).then(res => {
            var tHld = []
            for (var i = 0; i < res.data.length; i++) {
                if (i === 0) {
                    tHld[i] = res.data[i].UNameW
                } else {
                    tHld[i] = res.data[i].UNameW
                }
            }
            this.setState({
                cHld: tHld
            })
        })
    }

    //this function is called in componentDidMount to render on page load
    //this function checks to see if any diffs are associated with the file
    //and if so, it renders the page into a review display, instead of a 
    //file contents display
    loadReview = async () => {
        await axios.get("http://localhost:3002/DIFFS_ON_FILES/" + this.state.fileID, {
            headers: {accesstoken: this.state.CookieSave}
        }).then(res => {
            if (res.data.APPROVED === 0) {
                const diffRes = new Buffer.from(res.data.CommDiff, "binary").toString()
                this.setState({
                    isReview: 1,
                    revContent: <div>
                        <DiffDisplay
                            FID={this.state.fileID}
                            PID={this.state.routeID}
                            isOpen={false}
                            diffText={diffRes}>
                        </DiffDisplay>
                    </div>
                })
            } else {
                this.setState({
                    isReview: 0
                })
            }
        }).catch((error) => {
            this.setState({
                isReview: 0
            })
        })
    }

    //this function is associated with the links created to display Collaborators
    //by clicking on a name from the Collaborator menu, a user can be invited 
    //to review the file immediately
    inviteRevUser = async (iuName) => {
        await axios.get("https://www.4424081204.com:1111/INVITE_TO_REV/" + iuName, {
            headers: {accesstoken: this.state.CookieSave, fidref: this.state.fileID}
        }).then(res => {
            if ((res.data[0] === undefined) === false) {
                this.setState({
                    resu: res.data[0].ACCEPTED,
                    RevInv: 2
                })
            }
        })
        if (this.state.resu === -2) {
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
        else {
            await axios.put("https://www.4424081204.com:1111/INVITE_TO_REV/" + this.state.fileID, {
                DT: this.state.curTime,
                ACCEPTED: 0
            }, {headers: {accesstoken: this.state.CookieSave, riuname: iuName}
            }).then(res => {
                this.setState({
                    RevInv: 2
                })
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
                list_file_ids: hldLST
            })
        })
        await this.getProjName()
        await this.getReview()
        await this.loadCollab()
        await this.loadReview()
        await this.getFiles()
    }

    confirmDel = async () => {
        await axios.put("https://www.4424081204.com:1111/FILES_IN_PROJ/" + this.state.fileID, {
            FSTATUS: -1
        }, {
            headers: {accesstoken: this.state.CookieSave}
        }).then(res => {
            return window.location = "/Projects/" + this.state.routeID
        })
        /*await axios.delete("https://www.4424081204.com:1111/INVITES/" + this.state.routePara, {
            headers: {accesstoken: this.state.CookieSave}
        })*/
    }

    getProjName = async () => {
        await axios.get("http://localhost:3002/project/" + this.state.routeID, {
            headers: {accesstoken: this.state.CookieSave}
        }).then(res => {
            this.setState({
                ProjName: res.data[0].PROJNAME
            })
        })
    }

    updatingReview = async () => {
        this.setState({step: 3})
    }

    getFiles = async () => {
        
        const PIDREF = this.state.routeID;
        var temp = []
        await axios.get("https://www.4424081204.com:1111/FILES_IN_PROJ/" + PIDREF, {
            headers: {accesstoken: this.state.CookieSave, test: -1}
        }).then(res => {
            for (var i = 0; i < res.data.length; i++) {
                if(res.data[i].FSTATUS === 1) {
                    temp[i] = res.data[i].FNAME
                }                   
            }
            this.setState({
                fileNames: temp
            })
        })
    }

    createReview = async (e) => {

        e.preventDefault()
        if(this.state.fileName === '' || this.state.error === 3){
            this.setState({
                error: 1
            })
            return;
        }
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
        }).then(diffRes => {
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
                APPROVED: 0,
                OldFCONTENT: sqlRes.data[0].FCONTENT,
                OldFNAME: sqlRes.data[0].FNAME,
                OldFTYPE: sqlRes.data[0].FTYPE,
                NewFCONTENT: f2Content,
                NewFNAME: this.state.fileName,
                NewFTYPE: this.state.fileName.split(".").pop()
            }, {headers: {accesstoken: this.state.CookieSave}})
        })
    }

    setFile = async (e) => {
        e.preventDefault()
        if(e.target.files[0] === undefined){
            this.setState({
                error: 3
            })
            return;
        }
        this.setState({
            fileName: e.target.files[0].name,
        })
        const reader = new FileReader()
        reader.readAsText(e.target.files[0])
        reader.onload = async (e) => {
            this.setState({
                fileContent: e.target.result
            })
        }        
    }

    approveReview = async () => {
        await axios.get("http://localhost:3002/DIFFS_ON_FILES/" + this.state.fileID, {
            headers: {accesstoken: this.state.CookieSave}
        }).then(async res => {
            const newContent = new Buffer.from(res.data.NewFCONTENT, "binary").toString()
            await axios.put("https://www.4424081204.com:1111/FILES_IN_PROJ/" + this.state.fileID, {
                FNAME: res.data.NewFNAME,
                FTYPE: res.data.NewFTYPE,
                FCONTENT: newContent,
                DT: this.state.curTime
            }, {headers: {accesstoken: this.state.CookieSave}})
        })
        await axios.put("http://localhost:3002/DIFFS_ON_FILES/" + this.state.fileID, {
            APPROVED: 1
        }, {headers: {accesstoken: this.state.CookieSave}}).then(res => {

        })
        // await axios.put("https://www.4424081204.com:1111/FILES_IN_PROJ", {
        //     FNAME: this.state.fileName,
        //     FTYPE: fileType[fileType.length-1],
        //     FCONTENT: this.state.fileContent,
        //     DT: this.state.curTime,
        //     PIDREF: this.state.routePara,
        //     FSTATUS: 1
        // }, {headers: {accesstoken: this.state.CookieSave}}).then(function (res) {
        // })
    }

    render() {


        let popup = null;
        if (this.state.isOpen) {
            popup = (<Popup message={<div><p>This is permanent, and cannot be reversed</p><input type='submit' className='submit' value='Are you sure?' onClick={this.confirmDel}/></div>} closeMe={this.closePopup}/>);
        }

        const items = this.state.cHld.map((item, i) => <div key={i}><Link to={"/Projects/" + this.state.routeID + "/" + this.state.routePara} onClick={() => this.inviteRevUser(item)}>{item}<div className='divider'></div></Link></div>)

        switch (this.state.authState) {
            case ('loading'):
                return <h1>Loading</h1>
            case (1):
                return (

                    
                    <div>
                        <div style={{display:'flex', justifyContent:'center'}}>
                            <NavBar/>
                        </div>

                        <div className='boldtextSB' style={{marginLeft: '20px', marginRight: 'auto', paddingTop:'8px'}}>
                            Project: <Link to={"/Projects/" + this.state.routeID}>{this.state.ProjName}</Link>
                        </div>

                        <div className='boldtextLSB' style={{marginLeft: '20px', marginRight: 'auto'}}>
                                File: {this.state.routePara}<br></br>File
                                Type: {this.state.routePara.split('.').pop()}</div>
                        
                        <Link to={"/Projects/" + this.state.routeID + "/" + this.state.routePara + "/History_" + this.state.fileID}className='boldtextSDB' style={{marginLeft: '20px', marginRight: 'auto'}}>
                            File History
                        </Link>

                        <div style={{display:'flex'}}>
                            <div style={{marginLeft:'20px', marginRight:'auto', marginTop: '8px', marginBottom: '8px'}} className='collab-box'>
                                
                                <div style={{color:'lightcoral'}}>Collaborators:
                                    
                                    <div className='divider'></div>

                                </div>

                                {items}

                                {this.state.RevInv === 2 &&
                                    <div className='smllTEST'>Invite Sent!</div>
                                }

                            </div>

                            {this.state.isReview !== 1 &&
                                
                                <div>
                                    {this.state.step !==3 &&
                                        <input type="submit" className='submit' value="Update File" onClick={this.updatingReview}/>    
                                    }
                                    {this.state.step === 3 &&
                                        <div>

                                            <input type='submit' className='submitRED' value='Create Review' style={{alignSelf: "center"}} onClick={this.createReview}/>
                                            
                                            {this.state.error === 1 &&
                                                <div className = 'smll'>No file selected. Please try again.</div>
                                            }

                                            {this.state.error === 2 &&
                                                <div className = 'smll'>File already exists in project!</div>
                                            }

                                            {this.state.error === 3 &&
                                                <div className='smll'>Something went wrong selecting a file. Please try again.</div>
                                            }

                                            <input type="file" onChange={(e) => this.setFile(e)}/>

                                        </div>
                                    }
                                </div>
                            }
                        </div>

                        {this.state.isReview === 0 &&
                            <div className='grad1'>
                                <div className='grad2' style={{
                                    alignItems: 'center',
                                    flexDirection:"column"
                                }}>
                                    
                                    <div>{this.state.gotRev}</div>

                                </div>
                                
                                {popup}
                                <input type='submit' className='submit' value="Delete Review" onClick={this.openPopup}/>

                            </div>
                        }
                    
                        
                        {this.state.isReview === 1 &&
                        <div>
                            <input type="submit" className='submit' value="Approve Changes"
                                   onClick={this.approveReview}/>
                            <input type="submit" className='submit' value="Reject Changes"
                                   onClick={this.declineReview}/>
                            {this.state.revContent}
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

    declineReview() {

    }
}

export default RevDis;
