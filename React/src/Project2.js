import React from 'react';
import './App.css';
import './index2.css';
import './index.css';
import { Auth } from 'aws-amplify'
import axios from 'axios'
import NavBar from './NavBar'

class Project2 extends React.Component {

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
      step: -1
    };

    this.handleRevName = this.handleRevName.bind(this);
    this.updateStep = this.updateStep.bind(this);

  }

  getReview = async (d) => {
      await axios.get("http://localhost:3002/REVIEW/" + d).then(res => {
      this.setState({gotRev: res.data})
    })
  }
  
  showFile = async (e) => {
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
    await axios.post("http://localhost:3002/REVIEW", {
      REVNAME: this.state.RevName,
      CurrRev: this.state.fileContent,
      DT: this.state.curTime
    })
    this.setState({
      step: 1
    });
  }

  popRev = async () => {
    await axios.get("http://localhost:3002/REVIEW").then(res => {
      console.log("here", res)
      this.setState({newRevID: res.data})
    })
    await axios.post("http://localhost:3002/WORKS_ON_REVIEWS", {
      REVIDREF: this.state.newRevID,
      UNameW: this.state.Uname
    })
    .then(function (response) {
      console.log(response);
    })
  }

  popRev2 = async () => {
    await axios.get("http://localhost:3002/REVIEW").then(res => {
      console.log(res.data)
      this.setState({newRevID: res.data})
    })
  }

  loadRevs = async() => {
    var i;
    var hld = [];
    var tmp = this.state.RevIDLST.length;
    for(i = 0; i < tmp; i++){
      //console.log("http://localhost:3002/REVIEW/" + this.state.RevIDLST[i])
      await axios.get("http://localhost:3002/REVIEW/" + this.state.RevIDLST[i]).then(res => {
        //console.log(this.state.RevIDLST[i])
        console.log("Here is the " + i + " point of data: " + res.data)
        hld[i] = res.data;
      })      
    }
    this.setState({
      HOLDER: hld
    })
    console.log(this.state.HOLDER)
  }


  componentDidMount = async () => {
    const tokens = await Auth.currentSession();
    const userName = tokens.getIdToken().payload['cognito:username'];
    var userNameHold = userName.charAt(0).toUpperCase() + userName.slice(1);
    this.setState({Uname: userNameHold})
    //console.log('componentDidMount called')
    try {
      await Auth.currentAuthenticatedUser()
      this.setState({ authState: 1 })
    } catch (err) {
      this.setState({ authState: 'unauthorized' })
    }
    //console.log(this.state.Uname)
    await axios.get("http://localhost:3002/WORKS_ON_REVIEWS/" + this.state.Uname).then(res => {
      this.setState({REVIDLST: res.data})
      var hldLST = []
      var i;
      console.log(res.data.length)
      for(i = 0; i<res.data.length; i++){
        //console.log(res.data[i].REVIDREF)
        hldLST[i] = res.data[i].REVIDREF
        //console.log(hldLST[i])
      }
      this.setState({
        RevIDLST: hldLST
      })
      console.log(this.state.RevIDLST)
      //console.log(res.data)
    })
  }
    //console.log(this.state.authState)
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
    else if(this.state.step === 0) {
      this.setState({
        step: 1
      });
    }
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
            <h2>Welcome {this.state.Uname}</h2>
            <br></br>
            {this.state.step === -1 &&
              <input type="submit" className="submit" value="Create New Review" onClick={this.updateStep}/>
            }

            {this.state.step === 0 &&    
            <div>     
              <input type="file" onChange={(e) => this.showFile(e)} />
              <br></br>
              <input type = "text" name ="REVNAME" placeholder="Enter a name for your Review" value = {this.state.RevName} onChange={this.handleRevName}/>
              <br></br>
              <input type="submit" className="submit" value="Create New Review" onClick={this.popDB}/>        
              {/*<p style={{whiteSpace: 'pre'}}>{this.state.fileContent}</p>
              <p style={{whiteSpace: 'pre'}}>{this.state.HOLDER}</p>*/}
            </div>
            }
            <br></br>
            <input type="submit" className = "submit" value="Load test! (dont click this)" onClick={this.loadRevs}/>
            <br></br>
            {this.state.step === 1 &&
            <div>
            <p>{this.state.RevName}</p>
            <p>{this.state.fileName}</p>
            <input type="submit" className = "submit" value="Confirm New Review" onClick={this.popRev}/>
            </div>
            }
            {/*<p style={{whiteSpace: 'pre'}}>{this.state.HOLDER}</p>*/}
            {/*<input type="submit" className = "submit" value="Get Review!" onClick={() => this.getReview(12)}/>*/}
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

export default Project2;