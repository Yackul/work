import React from 'react';
import './App.css';
import './index.css';
import { Auth } from 'aws-amplify'
import axios from 'axios'
import NavBar from './NavBar'

class RevDis extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      routePara: 0,
      revID: -1,
      curTime : new Date().toLocaleString(),
      gotRev: '',
      Uname: '',
      RevName: '',
      RevIDLST: [],
      iUserN: '',
      step: -1
    };
    this.handleiUserNChange = this.handleiUserNChange.bind(this);
  }

  handleiUserNChange(evt) {
    this.setState({
    iUserN: evt.target.value,
    });
  };

  getReview = async () => {
      if(!this.state.RevIDLST.includes(this.state.routePara)){
        return window.location = "/Err404" 
      }
      else if(this.state.RevIDLST.includes(this.state.routePara)) {
        this.setState({
          revID: this.state.routePara
        })
        const hld = this.state.routePara;
        var hld2 = ""
        await axios.get("http://localhost:3002/REVIEW/" + hld).then(res => {
        //console.log("here", res)
            hld2 = res.data;
            hld2 = hld2.toString().split("$#BREAKBREAK")
            //console.log(hld2[0])
            this.setState({
                gotRev: hld2[1],
                RevName: hld2[0],
            })
        })
      }
  }

  invitingUser = async () => {
    this.setState({
      step: 1
    })
  }

  inviteUser = async () => {
    await axios.post("http://localhost:3002/INVITES/", {
      IREVID: this.state.revID,
      IUNAME: this.state.iUserN,
      FUNAME: this.state.Uname,
      DT: this.state.curTime
    })
    this.setState({
      step: 2
    })
  }

  componentDidMount = async () => {
    const x = parseInt(this.props.match.params.id)
    //console.log("x is an", x)
    this.setState({
        routePara: x
    })
    const tokens = await Auth.currentSession();
    const userName = tokens.getIdToken().payload['cognito:username'];
    var userNameHold = userName.charAt(0).toUpperCase() + userName.slice(1);
    this.setState({Uname: userNameHold})    
    try {
      await Auth.currentAuthenticatedUser()
      this.setState({ authState: 1 })
    } catch (err) {
      this.setState({ authState: 'unauthorized' })
    }
    await axios.get("http://localhost:3002/WORKS_ON_REVIEWS/" + this.state.Uname).then(res => {
        //console.log(this.state.Uname)
        this.setState({REVIDLST: res.data})
        var hldLST = []
        //console.log(res.data.length)
        for(var i = 0; i<res.data.length; i++){
          const x = i
          //console.log(res.data[i].REVIDREF)
          hldLST[x] = res.data[x].REVIDREF
          //console.log(hldLST[i])
        }
        this.setState({
          RevIDLST: hldLST
        })
        this.getReview()
        //console.log(this.state.RevIDLST)
      })
  }


  render() {

    
    switch (this.state.authState) {
      case ('loading'):
        return <h1>Loading</h1>
      case (1):
        return (
          
          <div>
            <NavBar/>
            <br></br>
            <div>
            <input type="submit" className='submit' value="Invite a User to Review" onClick={this.invitingUser}/>
            {this.state.step === 1 &&
            <div>
            <br></br>
            <input type="text" placeholder="Enter a username" value={this.state.iUserN} onChange={this.handleiUserNChange}/>
            <br></br>
            <input type ='submit' className='submit' value='Send Invite' onClick={this.inviteUser}/>
            </div>
            }
            {this.state.step === 2 &&
            <div className = 'smll'>Invitation sent to {this.state.iUserN}!</div>
            }
            </div>
            <div>Review Page with dynamic routing!</div>
            <p style={{whiteSpace: 'pre'}}>Current Review: {this.state.RevName}<br></br> {this.state.gotRev}</p>



            {/*<p style={{whiteSpace: 'pre'}}>{this.state.gotRev}</p>*/}
            
            
            <br></br>   

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