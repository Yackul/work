import React from 'react';
import './index.css';
import {Auth} from 'aws-amplify'
import axios from 'axios'
import NavBar from './NavBar'
import Cookies from 'js-cookie'
import {Link} from "react-router-dom";

class ProjectsDisplayPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ProjName: '',
            routePara: 0,
            routeName: "",
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
            fileNames: [],
            fileDates: [],
            error: -1,
            inv: 0,
            creator_flag: -1
        };
        this.handleiUserNChange = this.handleiUserNChange.bind(this);
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
            var temp_dates = []
            await axios.get("https://www.4424081204.com:1111/FILES_IN_PROJ/" + PIDREF, {
                headers: {accesstoken: this.state.CookieSave, test: -1}
            }).then(res => {
                for (var i = 0; i < res.data.length; i++) {
                    if(res.data[i].FSTATUS === 1) {
                        temp[i] = res.data[i].FNAME
                        temp_dates[i] = res.data[i].DT
                    }                    
                }
                this.setState({
                    fileNames: temp,
                    fileDates: temp_dates
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
        var switch_var
        await axios.get("https://www.4424081204.com:1111/INVITES/" + this.state.iUserN, {
            headers: {accesstoken: this.state.CookieSave, rid: this.state.routePara}
        }).then(res => {
            if (res.data[0] === undefined) {
                switch_var = 0
            }
            else if(res.data[0].ACCEPTED === 1){
                switch_var = 1
            }
            else{
                switch_var = 2
            }
        })
        if(switch_var === 0){
            var switch_var_lock;
            await axios.get("https://www.4424081204.com:1111/PROJECT/" + this.state.routePara, {
                headers:{accesstoken: this.state.CookieSave}
            }).then(res => {
                if(res.data[0].CREATOR === this.state.iUserN){
                    console.log("here1")
                    this.setState({
                        inv:2
                    })
                    switch_var_lock = 1;
                }
            })
            if(switch_var_lock !== 1) {
                await axios.post("https://www.4424081204.com:1111/INVITES/", {
                IREVID: this.state.routePara,
                IUNAME: this.state.iUserN,
                FUNAME: this.state.Uname,
                DT: this.state.curTime,
                ProjName: this.state.routeName
                }, {
                    headers: {accesstoken: this.state.CookieSave}
                })

                this.setState({
                    inv: 1,
                    step: -1
                })
            }
        }
        else if(switch_var === 1){
            this.setState({
                inv:2
            })
        }

        else if(switch_var === 2){

            await axios.put("https://www.4424081204.com:1111/INVITES/" + this.state.routePara, {
                DT: this.state.curTime,
                ACCEPTED: 0
                }, {
                    headers: {accesstoken: this.state.CookieSave, iuname: this.state.iUserN}
                })
    
                this.setState({
                    inv: 1,
                    step: -1
                })
        }
        
        
    }

    componentDidMount = async () => {
        document.body.style.background = "#F5F5DC";
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
            var hldLST = []
            for (var i = 0; i < res.data.length; i++) {
                const x = i
                hldLST[x] = res.data[x].PIDREF
                if(res.data[x].PIDREF === this.state.routePara)
                    this.setState({
                        routeName: res.data[x].PName
                    })
            }
            this.setState({
                FIDLST: hldLST
            })
        })
        await this.getProjName();
        await this.getFiles()
        await this.loadCollab();
        await this.isCreator();
    }

    isCreator = async () => {
        await axios.get("https://www.4424081204.com:1111/PROJECT/" + this.state.routePara, {
            headers:{accesstoken: this.state.CookieSave}
        }).then(res => {
            if(res.data[0].CREATOR === this.state.Uname){
                this.setState({
                    creator_flag: 1
                })
            }
            else{
                this.setState({
                    creator_flag: 0
                })
            }            
        })
    }

    getProjName = async () => {
        await axios.get("https://www.4424081204.com:1111/project/" + this.state.routePara, {
            headers: {accesstoken: this.state.CookieSave}
        }).then(res => {
            this.setState({
                ProjName: res.data[0].PROJNAME
            })
        })
    }


    confirmDel = async () => {
        await axios.put("https://www.4424081204.com:1111/works_on_projects/" + this.state.routePara, {
            PSTATUS: -1,
        }, {headers: {accesstoken: this.state.CookieSave}})
        await axios.put("https://www.4424081204.com:1111/project/" + this.state.routePara, {
            PSTATUS: -1,
        }, {headers: {accesstoken: this.state.CookieSave}})
        return window.location = "/Projects"
    }


    setFile = async (e) => {
        e.preventDefault()
        if(e.target.files[0] === undefined){
            this.setState({
                error: 3
            })
            return;
        }
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
        if(this.state.fileName === '' || this.state.error === 3){
            this.setState({
                error: 1
            })
            return;
        }
        else if(this.state.fileNames.includes(this.state.fileName)){
            this.setState({
                error: 2
            })
            return;
        }
        this.setState({error:-1})
        const fileType = this.state.fileName.toString().split('.')
        await axios.post("https://www.4424081204.com:1111/FILES_IN_PROJ", {      
          FNAME: this.state.fileName,
          FTYPE: fileType[fileType.length-1],
          FCONTENT: this.state.fileContent,
          DT: this.state.curTime,
          PIDREF: this.state.routePara,
          FSTATUS: 1
        }, {headers: {accesstoken: this.state.CookieSave}}).then(function (res) {
        })
        this.setState({
          step: 1
        });
        this.updateStep();
      }

    on() {
        document.getElementById("delete_overlay").style.display = "block";
    }

    off() {
        document.getElementById("delete_overlay").style.display = "none";
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
        else if(this.state.step > 1){
            this.setState({
                step: 0
            })
        }
      }

    createFileLinks() {
        const items = this.state.fileNames.map((item, i) =>
        <tr key= {i}>
            <th>
                <a key={i} href ={this.state.routePara + "/" + this.state.fileNames[i]}>{item}</a></th>
                <th>{item.split(".").pop()}</th>
                <th>{this.state.fileDates[i]}</th>
            </tr>)
        return items
    }

    render() {
        const items = this.state.cHld.map((item, i) => <div key={i}>{item}<div className='divider'></div></div>)

        const fileLinks = this.createFileLinks()

        switch (this.state.authState) {

            case ('loading'):
                return <h1>Loading</h1>

            case (1):
                return (

                    <div>
                        <div className = 'test2'>
                            <NavBar/>
                        </div>

                        <div className='boldtextSB' style={{marginLeft: '20px', marginRight: 'auto', paddingTop:'8px'}}>
                            Project: {this.state.ProjName}
                        </div>

                        <Link to={"/Projects/" + this.state.routePara} className='boldtextSDB' style={{marginLeft: '20px', marginRight: 'auto'}}>
                            Project History
                        </Link>

                        <br></br>

                        <div style={{display:'flex'}}>

                            <div style={{marginLeft:'20px', marginRight:'auto', marginTop: '8px', marginBottom: '8px'}} className='collab-box'>
                                
                                <div style={{color:'lightcoral'}}>Collaborators:
                                    
                                    <div className='divider'></div>

                                </div>

                                {items}

                            </div>

                            <div>
                                {this.state.step === -1 &&
                                    <div>
                                        <input type="submit" className="submit" value="Add a file to project" onClick={this.updateStep}/>
                                        <input type="submit" className='submit' value="Invite a user to project" onClick={this.invitingUser}/>
                                    </div>
                                }
                                
                                {this.state.step === 0 &&
                                    <div> 
                                        <input type="submit" className="submitRED" value="Add file" onClick={this.popDB}/>
                                        <input type="file" onChange={(e) => this.setFile(e)}/>
                                        <input type="submit" className='submit' value="Invite a User to project" onClick={this.invitingUser}/>
                                        {this.state.error === 1 &&
                                            <div className = 'smll'>No file selected. Please try again.</div>
                                        }
                                        {this.state.error === 2 &&
                                            <div className = 'smll'>File already exists in project!</div>
                                        }
                                        {this.state.error === 3 &&
                                            <div className='smll'>Something went wrong selecting a file. Please try again.</div>
                                        }
                                    </div>
                                }

                                {this.state.step === 1 &&
                                    <Link to ={"/Projects/"+ this.state.routePara}><input type ="submit" className = "submit" value= "Return to project page?" onClick={this.updateStep}/></Link>    
                                }
                                    
                                {this.state.step === 3 &&
                                    <div style={{marginRight: '10px'}}>
                                        <input type="submit" className="submit" value="Add a file to project" onClick={this.updateStep}/>
                                        <input type='submit' className='submitRED' value='Send Invite' onClick={this.inviteUser}/>
                                        
                                        <input style={{width: 150}}type="text" placeholder="Enter a username" value={this.state.iUserN} onChange={this.handleiUserNChange}/> 
                                    </div>
                                }

                                {this.state.inv === 1 &&
                                    <div style={{float:'right', marginRight:'14px'}} className='smll'>Invitation sent to {this.state.iUserN}!</div>
                                }
                                {this.state.inv === 2 &&
                                    <div style={{float:'right', marginRight:'14px'}} className='smll'>User already on project.</div>
                                }

                            </div>
                        </div>
                                <br></br>
                                <br></br>
                        <div className='grad1'>
                            <div className= "files-box">
                                <div style={{whiteSpace: 'pre-wrap'}}>
                                    <table>
                                        <tr>
                                            <th style ={{paddingRight: "200px"}}>File Name</th>
                                            <th style ={{paddingRight: "200px"}}>File Type</th>
                                            <th style ={{paddingRight: "200px"}}>Date Modified</th>
                                        </tr>
                                        {fileLinks}                                                         
                                    </table>  
                                </div>   
                            </div>
                        </div>

                        {this.state.creator_flag === 1 &&
                            <div style={{float:'right'}}>
                                <div className = "file_display_delete">
                                        <input type='submit' className='submit_delete' value="Delete Project" onClick={this.on}/>
                                </div>
                                <div id="delete_overlay" onClick={this.off}>
                                    <div id="del_text"><p>This is permanent, and cannot be reversed</p><input style={{display: "block", margin: "0 auto"}} type='submit' className='submit' value='Are you sure?' onClick={this.confirmDel}/></div>
                                </div>
                            </div>
                        }
                    </div>                    
                );

            case ('unauthorized'):
                return window.location = "/LogIn"

            default:
                return null
        }
    }
}

export default ProjectsDisplayPage;