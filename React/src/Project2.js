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
      RevName: '',
      RevIDLST: [],
      HOLDER: [],
      newRevID: '',
      newCommID: '',
      step: -1,
      step2: 0,
      fname: '',
      CookieSave: '',
    };

    this.handleRevName = this.handleRevName.bind(this);
    this.updateStep = this.updateStep.bind(this);
    this.creProjButts = this.creProjButts.bind(this);

  }

  getReview = async (d) => {

      var hld2 = ""
      await axios.get("https://www.4424081204.com:1111/REVIEW/" + d, {
        headers: {accesstoken: this.state.CookieSave}
      }).then(res => {
      hld2 = res.data;
      hld2 = hld2.toString().split("$#BREAKBREAK")
      if(this.myMounted){
        this.setState({
          gotRev: hld2[2],
          fname: hld2[1],
          RevName: hld2[0],
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

  popDB = async () => {
    await axios.post("https://www.4424081204.com:1111/REVIEW", {      
      REVNAME: this.state.RevName,
      CurrRev: this.state.fileContent,
      DT: this.state.curTime,
      FName: this.state.fileName
    }, {headers: {accesstoken: this.state.CookieSave}}).then(function (res) {
    })
    this.setState({
      step: 1
    });
  }

  popRev = async () => {
    await axios.get("https://www.4424081204.com:1111/REVIEW", {
    headers: {accesstoken: this.state.CookieSave}
  }).then(res => {
      this.setState({newRevID: res.data})
    })
    await axios.post("https://www.4424081204.com:1111/WORKS_ON_PROJECTS", {  
      REVIDREF: this.state.newRevID,
      UNameW: this.state.Uname
    }, {headers: {accesstoken: this.state.CookieSave}}).then(function (res) {
    })
    this.setState({
      step: 2
    })
  }


  loadRevs = async() => {
    var hld = [];
    var tmp = this.state.RevIDLST.length;

    for(var i = 0; i < tmp; i++){
      const x = i
      await axios.get("https://www.4424081204.com:1111/REVIEW/" + this.state.RevIDLST[x], {
        headers: {accesstoken: this.state.CookieSave}
      }).then(res => {
        hld[x] = res.data;
      })      
    }
    this.setState({
      HOLDER: hld
    })
  }

  componentDidMount = async () => {
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
      for(var i = 0; i<res.data.length; i++){
        const x = i
        hldLST[x] = res.data[x].REVIDREF
      }
      this.setState({
        RevIDLST: hldLST
      })
    })
  }

  componentWillUnmount() {
    this._myMounted = false;
  }
  handleRevName(evt){
    this.setState({
      RevName: evt.target.value,
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
    const items = this.state.RevIDLST.map((item, i) =><Link key={i} to ={'Projects/' + item}><input key = {i} type="submit" className="submit" value={"Project " + item} onClick={this.getReview.bind(this, (item.valueOf(item)))}/></Link>)
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
              <input type="submit" className="submit" value="Create New Review" onClick={this.updateStep}/>
              </div>
            }

            {this.state.step === 0 &&    
            <div>
              <input type="file" onChange={(e) => this.setFile(e)} />
              <br></br>
              <input type = "text" name ="REVNAME" placeholder="Enter a name for your Review" value = {this.state.RevName} onChange={this.handleRevName}/>
              <br></br>
              <input type="submit" className="submit" value="Create New Review" onClick={this.popDB}/>        
              
            </div>
            }
            {this.state.step === 1 &&
            <div>
            <p>Review Name: {this.state.RevName}</p>
            <p>File Name: {this.state.fileName}</p>
            <input type="submit" className = "submit" value="Confirm New Review" onClick={this.popRev}/>
            </div>
            }
            {this.state.step === 2 &&
            <div><p>Review Successfully Created!</p>
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