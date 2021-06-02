import React from 'react';
import PropTypes from 'prop-types';
import axios from "axios";
import DiffDisplay from './DiffDisplay';
import NavBar from './NavBar'
import { Auth } from 'aws-amplify'
import Cookies from 'js-cookie'

class ReviewCreator extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            show: false,
            packageFile: '',
            fileName: 'test.c',
            diffText: '',
            result: '',
            diffList: [],
            curTime : new Date().toLocaleString(),
            Uname: '',
            newCommID: '',
            newRevID: '',
            CookieSave: '',
            commentId: 1,
            comments: '',
        };
    }

    componentDidMount = async () => {
        document.body.style.background = "#d0f0f0e1";
        const tokens = await Auth.currentSession();
        const userName = tokens.getIdToken().payload['cognito:username'];
        var userNameHold = userName.charAt(0).toUpperCase() + userName.slice(1);
        document.cookie = "clientaccesstoken="+ tokens.getAccessToken().getJwtToken()+';';
        const temp = Cookies.get('clientaccesstoken')       
        this.setState({Uname: userNameHold,
            CookieSave: temp})
    }

    handleClick1() {
        axios.post('https://www.4424081204.com/min_diff', {
            fileName: this.state.fileName
        })
            .then((response) => {
                //console.log(response)
                this.setState({result: response['data']})
                this.setState({diffText: this.state.result})
                //console.log(this.state.diffText)
            }, (error) => {
                console.log(error)
                alert(error)
            });
            this.newFun()
    }
    
    newFun = async () => {
        await axios.post("https://www.4424081204.com:1111/COMMITS", {
            CommMEssage: "This is a commit message",
            CommAppro: 1,
            DT: this.state.curTime,
            WhatRevID: 1,
            UNameCom: this.state.Uname
          }, {headers: {accesstoken: this.state.CookieSave}}).then(function (res) {
            //console.log("whynowork lmao")
          })
          await axios.get("https://www.4424081204.com:1111/COMMITS", {
            headers: {accesstoken: this.state.CookieSave}
          }).then(res => {
            this.setState({newCommID: res.data})
          })
    }

    handleClick2() {
        axios.post('https://www.4424081204.com/full_diff', {
            headers: {accesstoken: this.state.CookieSave},
            repoPath: this.state.packageFile,
            fileName: this.state.fileName
        })
            .then((response) => {
                //console.log(response)
                this.setState({result: response['data']})
                this.setState({diffText: this.state.result})
            }, (error) => {
                console.log(error)
                alert(error)
            });
            this.newFun2()
    }

    newFun2 = async () => {
        await axios.post("https://www.4424081204.com:1111/COMMITS", {
            CommMEssage: "This is a commit message",
            CommAppro: 1,
            DT: this.state.curTime,
            WhatRevID: 1,
            UNameCom: this.state.Uname
          }, {headers: {accesstoken: this.state.CookieSave}}).then(function (res) {
          })
          await axios.get("https://www.4424081204.com:1111/COMMITS", {
            headers: {accesstoken: this.state.CookieSave}
          }).then(res => {
            this.setState({newCommID: res.data})
          })
        await axios.post("https://www.4424081204.com:1111/COMMITS_ON_REVIEWS", {
            CommID: this.state.newCommID,
            REVID: 1,
            CommDT: this.state.curTime,
            CommDiff: this.state.diffText
          }, {headers: {accesstoken: this.state.CookieSave}}).then(function (res) {
          })
    }

    showFile() {

        const reader = new FileReader();
        reader.onload = function () {
            const text = reader.result
            alert(text)
        };
        reader.readAsText(this.state.packageFile)
    }

    createDiff() {
        this.setState({
            diffList: this.state.diffList.concat(<div>
                <DiffDisplay show={this.state.isOpen}
                             diffText={this.state.diffText}>
                </DiffDisplay>
            </div>)
        })
    }

    clearDiffs() {
        this.setState({diffList: []})
    }

    render() {

        return (

            <div className='grad1'>
                <NavBar/>
                
                    {this.props.children}
                    <div className="button">
                    <button onClick={(e) => this.handleClick1()}>Set minimal diff</button> &nbsp;
                    <button onClick={(e) => this.handleClick2()}>Set full diff</button> &nbsp;&nbsp;&nbsp;&nbsp;
                    {/* <br/>
                    <br/> */}
                    <button onClick={(e) => this.createDiff()}>Create Diff</button> &nbsp;
                    <button onClick={(e) => this.clearDiffs()}>Clear Diffs</button>
                </div>
                <div style={{padding: 10}}>
                    {this.state.diffList}
                </div>
            </div>
        );
    }
}

ReviewCreator.propTypes = {
    children: PropTypes.node,
};

export default ReviewCreator;