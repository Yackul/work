import React from 'react';
import './App.css';
import './index2.css';
import './index.css';
import { Auth } from 'aws-amplify'
import axios from 'axios'
import NavBar from './NavBar'
import {Link} from "react-router-dom";
import Cookies from 'js-cookie'

class Project2 extends React.Component {
  myMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      fileContent: '',
      fileName: '',
      curTime : new Date().toLocaleString(),
      gotRev: '',
      Uname: '',
      PROJNAME: '',
      PIDLST: [],
      PrNaLST: [],
      HOLDER: [],
      newPID: '',
      newCommID: '',
      step: -1,
      step2: 0,
      fname: '',
      CookieSave: '',
    };

    this.handlePROJNAME = this.handlePROJNAME.bind(this);
    this.updateStep = this.updateStep.bind(this);
    this.creProjButts = this.creProjButts.bind(this);

  }

  getProj = async (d) => {
      var hld2 = ""
      await axios.get("https://www.4424081204.com:1111/PROJECT/" + d, {
        headers: {accesstoken: this.state.CookieSave}
      }).then(res => {
      hld2 = res.data;
      hld2 = hld2.toString().split("$#BREAKBREAK")
      if(this.myMounted){
        this.setState({
          gotRev: hld2[2],
          PROJNAME: hld2[0],
          step2: 1
        })
      }
    })
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

  //this will just make a new entry on project page for user to click on and go to
  popDB = async () => {
    await axios.post("https://www.4424081204.com:1111/PROJECT", {      
      PROJNAME: this.state.PROJNAME,
      DT: this.state.curTime,
    }, {headers: {accesstoken: this.state.CookieSave}}).then(function (res) {
    })
    this.setState({
      step: 1
    });
  }

//this needs to be redefined for multi file usage projects will redirect and include route parameter... somehow... probably projname
  popRev = async () => {
    await axios.get("https://www.4424081204.com:1111/PROJECT", {
    headers: {accesstoken: this.state.CookieSave}
  }).then(res => {
      this.setState({newPID: res.data})
    })
    await axios.post("https://www.4424081204.com:1111/WORKS_ON_PROJECTS", {  
      PIDREF: this.state.newPID,
      UNameW: this.state.Uname,
      PName: this.state.PROJNAME
    }, {headers: {accesstoken: this.state.CookieSave}}).then(function (res) {
    })
    this.setState({
      step: 2
    })
  }

//i dont think this is in use
/*
  loadProj = async() => {
    var hld = [];
    var tmp = this.state.PIDLST.length;

    for(var i = 0; i < tmp; i++){
      const x = i
      await axios.get("https://www.4424081204.com:1111/PROJECT/" + this.state.PIDLST[x], {
        headers: {accesstoken: this.state.CookieSave}
      }).then(res => {
        hld[x] = res.data;
      })      
    }
    this.setState({
      HOLDER: hld
    })
  }
*/
  componentDidMount = async () => {
    document.body.style.background = "#d0f0f0e1";
    this._myMounted = true;
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
    await axios.get("https://www.4424081204.com:1111/WORKS_ON_PROJECTS/" + this.state.Uname, {
      headers: {accesstoken: this.state.CookieSave}
    }).then(res => {
      var hldLST = []
      var hldLST2 = []
      for(var i = 0; i<res.data.length; i++){
        const x = i
        hldLST[x] = res.data[x].PIDREF
        hldLST2[x] = res.data[x].PName
      }
      this.setState({
        PIDLST: hldLST,
        PrNaLST: hldLST2
      })
    })
  }

  componentWillUnmount() {
    this._myMounted = false;
  }
  handlePROJNAME(evt){
    this.setState({
      PROJNAME: evt.target.value,
    });
  }
  updateStep = async (e) => {
    e.preventDefault();
    if(this.state.step === -1){
      this.setState({
        step: 0
      });
    }
    else if(this.state.step === 2) {
      this.setState({
        step: -1
      })
      return window.location = "/Projects"
    }
  }

  creProjButts() {
    const items = this.state.PIDLST.map((item, i) =><Link key={i} to ={'Projects/' + item}><input key = {i} type="submit" className="submit" value={"Project " + this.state.PrNaLST[item-1]} onClick={this.getProj.bind(this, (item.valueOf(item)))}/></Link>)
    return items
  }

  render() {

    const projs = this.creProjButts()
    
    switch (this.state.authState) {
      case ('loading'):
        return <h1>Loading</h1>
      case (1):
        return (

          <div className='grad1'>
            <NavBar/>
            <div className='container'>
            <div>{this.state.Uname}'s Projects<br></br>{projs}</div>
            
            {this.state.step === -1 &&
              <div>
              <input type="submit" className="submit" value="Create New Project" onClick={this.updateStep}/>
              </div>
            }

            {this.state.step === 0 &&    
            <div>
              {/*<input type="file" onChange={(e) => this.setFile(e)} />*/}
              <br></br>
              <input style={{width:220}}type = "text" name ="PROJNAME" placeholder="Enter a name for your Project" value = {this.state.PROJNAME} onChange={this.handlePROJNAME}/>
              <br></br>
              <input type="submit" className="submit" value="Create New Project" onClick={this.popDB}/>        
              
            </div>
            }
            {this.state.step === 1 &&
            <div>
            <p>Project Name: {this.state.PROJNAME}</p>
            <input type="submit" className = "submit" value="Confirm New Project" onClick={this.popRev}/>
            </div>
            }
            {this.state.step === 2 &&
            <div><p>Project Successfully Created!</p>
            <br></br>
            <Link to ="/Projects"><input type ="submit" className = "submit" value= "Return to your Projects?" onClick={this.updateStep}/></Link>
            </div>
            }
            
            
            
            <br></br>   
            </div>
          </div>
        );
      case ('unauthorized'):
        return window.location = "/"
      default:
        return null
    }
  }
}

export default Project2;