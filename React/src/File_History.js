import React from 'react';
import './index.css';
import NavBar from './NavBar'
import { Auth } from 'aws-amplify'
import axios from 'axios';
import Cookies from 'js-cookie'
import DiffDisplay from "./DiffDisplay";

class File_Hist extends React.Component {

    constructor(props) {

        super(props)
        this.state = {

            authState: 'loading',
            User_Name: '',
            Cookie_Save: '',         
            File_ID: -1,
            Project_ID: -1,
            Diffs_Arr: [],
            Collab_List: [],
            isOpen: false,
            hold_me_bb: -1,
            message: ""
        };

    }

    //on page render, this function is automatically called! Keep it clean and write functions for stuff you need here!
    //or be a jabroni and clutter this with random functionalities! Your choice!
    componentDidMount = async () => {
    
        await this.Set_Background();
        await this.Get_User_Auth();
        await this.Get_Project_ID();
        await this.Load_Collaborators();
        await this.Get_File_ID();
        await this.Load_File_History();
    }

    //sets the background for the page
    Set_Background = async() => {

        document.body.style.background = "#F5F5DC";  
    }

    //builds out user auth on the page (making sure they're logged in, etc) and grabs username from Cognito
    Get_User_Auth = async() => {

        try {
            await Auth.currentAuthenticatedUser()
            const tokens = await Auth.currentSession();

            const userName = tokens.getIdToken().payload['cognito:username'];
            var userNameHold = userName.charAt(0).toUpperCase() + userName.slice(1);

            document.cookie = "clientaccesstoken="+ tokens.getAccessToken().getJwtToken()+';';
            const temp = Cookies.get('clientaccesstoken')      

            this.setState({ authState: 1,
                User_Name: userNameHold,
                Cookie_Save: temp
            })
        }
        catch (err) {
          this.setState({ authState: 'unauthorized' })
        }
    }

    //always useful to have file_ID stored on the page somewhere. This makes it so
    //any function can call this.state.File_ID instead of populating it at some other point
    Get_File_ID = async() => {

        const x = parseInt(this.props.match.params.id3)
        this.setState({
            File_ID: x
        })
    }

    //always useful to have Project_ID stored on the page somewhere. This makes it so
    //any function can call this.state.File_ID instead of populating it at some other point
    Get_Project_ID = async() => {

        const x = parseInt(this.props.match.params.id)
        this.setState({
            Project_ID: x
        })
    }

    //this function is called in componentDidMount to render on page load
    //this checks to see if any other user is working on this project
    //and if so, it saves them to a list, Collab_List.
    Load_Collaborators = async () => {
        
        await axios.get("https://www.4424081204.com:1111/WORKS_ON_PROJECTS/", {
            headers: {accesstoken: this.state.Cookie_Save, test: this.state.Project_ID}
        }).then(res => {
            var temp_list = []
            for (var i = 0; i < res.data.length; i++) {
                temp_list[i] = res.data[i].UNameW                
            }
            this.setState({
                Collab_List: temp_list
            })
        })
    }

    //loads all of the changes to a file into an array. Should be fun figuring out how to render everything!
    Load_File_History = async () => {

        await axios.get("https://www.4424081204.com:1111/DIFFS_ON_FILES/" + this.state.File_ID, {
            headers: {accesstoken: this.state.Cookie_Save, history_var: this.state.File_ID}
        }).then(res => {
            var temp_arr = []
            for(var i = 0; i < res.data.length; i++){
                temp_arr[i] = res.data[i];
            }
            this.setState({
                Diffs_Arr: temp_arr
            })
        })
    }  
    
    on = (e) => {
        const Pop_Mess = new Buffer.from(this.state.Diffs_Arr[e].CommDiff, "binary").toString()
        var message_cons=
        <DiffDisplay
            FID={this.state.File_ID}
            PID={this.state.Project_ID}
            isOpen={true}
            diffText={Pop_Mess}
            isSplit={false}
            >
        </DiffDisplay>;
        this.setState({
            message: message_cons
        })
        document.getElementById("hist_overlay").style.display = "block";
    }

    off() {
        document.getElementById("hist_overlay").style.display = "none";
    }

    render() {
          
        
        const Collab_Display = this.state.Collab_List.map((item, i) => <div key={i}>{item}<div className='divider'></div></div>)
        
        const Hist_Display = this.state.Diffs_Arr.map((item, i) => 
        <tr key={i}>
            <th>{this.state.Diffs_Arr[i].DID}</th>
            <th>{this.state.Diffs_Arr[i].CREATEDBY}</th>
            <th>{this.state.Diffs_Arr[i].FIDREF}</th>
            <th>{this.state.Diffs_Arr[i].CommDT}</th>
            <th>{this.state.Diffs_Arr[i].APPROVED}</th>
            <th>{this.state.Diffs_Arr[i].OldFNAME}</th>
            <th>{this.state.Diffs_Arr[i].OldFTYPE}</th>
            <th><input type = "submit" className="submit_fix" value= "View File" onClick={() => this.on(i)}/></th>
            </tr>);
    
        switch (this.state.authState) {

            case ('loading'):
                return <h1>Loading</h1>

            case (1):
                return (

                    <div>
                        <div className = 'test2'>
                            <NavBar/>
                        </div>
                
                        <div style={{display:'flex'}}>

                            <div style={{marginLeft:'20px', marginRight:'auto', marginTop: '8px', marginBottom: '8px'}} className='collab-box'>
                                
                                <div style={{color:'lightcoral'}}>Collaborators:
                                    
                                    <div className='divider'></div>

                                </div>

                                {Collab_Display}

                            </div>
                        </div>
                    
                        <br></br>
                        <br></br>

                        <div className = 'grad4'>
                            <div className='grad3' style={{
                                alignItems: 'center',
                                flexDirection:"column"
                            }}>    
                            <div style={{whiteSpace: 'pre-wrap'}}>
                                <table>
                                    <tr>
                                        <th>Update ID</th>
                                        <th>Updated By</th>
                                        <th>File ID</th>
                                        <th>Date</th>
                                        <th>Approved?</th>
                                        <th>File_Name</th>
                                        <th>File_Type</th>
                                        <th>View</th>
                                    </tr>
                                    {Hist_Display}                                                         
                                </table> 
                            </div>   
                            </div>                            
                        </div>
                        <div id="hist_overlay" onClick={this.off}>
                                    <div><p id="hist_text">{this.state.message}</p></div>
                                </div>        
                    </div>
                );

            case ('unauthorized'):
                return window.location = "/LogIn"

            default:
                return null
        }
    }
}

export default File_Hist