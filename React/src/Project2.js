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
      curTime : new Date().toLocaleString(),
      gotRev: '',
      Uname: '',
      RevIDLST: [],
      HOLDER: []
    };

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
      console.log(text)
      this.setState({
        fileContent: text
      })
    };
    reader.readAsText(e.target.files[0])

  }

  popRev = async (d) => {
    await axios.post("http://localhost:3002/WORKS_ON_REVIEWS", {
      REVIDREF: d,
      UNameW: this.state.Uname
    })
    .then(function (response) {
      console.log(response);
    })
  }

  loadRevs = async() => {
    var i;
    var hld = [];
    var tmp = this.state.RevIDLST.length;
    for(i = 0; i < tmp; i++){
      console.log("http://localhost:3002/REVIEW/" + this.state.RevIDLST[i])
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
      for(i = 0; i<res.data.length; i++){
        //console.log(res.data[i].REVIDREF)
        hldLST[i] = res.data[i].REVIDREF
        console.log(hldLST[i])
      }
      this.setState({
        RevIDLST: hldLST
      })
      //console.log(this.state.RevIDLST)
      //console.log(res.data)
    })
  }
    //console.log(this.state.authState)
  

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
            <form action = "http://localhost:3002/REVIEW" method = "post">
            <input type = "hidden" name ="CurrRev"  value = {this.state.fileContent}/>
            <input type = "hidden" name ="REVNAME"  value = 'test'/>
            <input type = "hidden" name = "DT" value = {this.state.curTime}/>
            <input type="file" onChange={(e) => this.showFile(e)} />
            <input type="submit" className="submit" value="Create Review" onClick={() => this.popRev(1)}/>        
            <p style={{whiteSpace: 'pre'}}>{this.state.fileContent}</p>
            <p style={{whiteSpace: 'pre'}}>{this.state.HOLDER}</p>
            </form>
            <input type="submit" className = "submit" value="Load Review!" onClick={this.loadRevs}/>
            <p style={{whiteSpace: 'pre'}}>{this.state.HOLDER}</p>
            {/*<input type="submit" className = "submit" value="Get Review!" onClick={() => this.getReview(12)}/>*/}
            <p style={{whiteSpace: 'pre'}}>{this.state.gotRev}</p>
            
            
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