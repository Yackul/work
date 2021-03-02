import React from 'react';
import PropTypes from 'prop-types';
import axios from "axios";
import DiffDisplay from './DiffDisplay';
import NavBar from './NavBar'
import { Auth } from 'aws-amplify'

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
            newRevID: ''
        };
    }

    componentDidMount = async () => {
        const tokens = await Auth.currentSession();
        const userName = tokens.getIdToken().payload['cognito:username'];
        var userNameHold = userName.charAt(0).toUpperCase() + userName.slice(1);
        this.setState({Uname: userNameHold})
    }

    handleClick1() {
        axios.post('https://www.4424081204.com/min_diff', {
            repoPath: this.state.packageFile,
            fileName: this.state.fileName
        })
            .then((response) => {
                //console.log(response)
                this.setState({result: response['data']})
                this.setState({diffText: this.state.result})
                console.log(this.state.diffText)
            }, (error) => {
                console.log(error)
                alert(error)
            });
            this.newFun()
    }
    
    newFun = async () => {
        await axios.post("http://localhost:3002/COMMITS", {
            CommMEssage: "This is a commit message",
            CommAppro: true,
            DT: this.state.curTime,
            WhatRevID: 1,
            UNameCom: this.state.Uname
          }).then(function (res) {
            //console.log("whynowork lmao")
          })
          await axios.get("http://localhost:3002/COMMITS").then(res => {
            console.log("here is res", res)
            this.setState({newCommID: res.data})
          })
        await axios.post("http://localhost:3002/COMMITS_ON_REVIEWS", {
            CommID: this.state.newCommID,
            REVID: 1,
            CommDT: this.state.curTime,
            CommDiff: this.state.diffText
          }).then(function (res) {
            //console.log("whynowork lmao")
          })
    }


    handleClick2() {
        axios.post('https://www.4424081204.com/full_diff', {
            repoPath: this.state.packageFile,
            fileName: this.state.fileName
        })
            .then((response) => {
                console.log(response)
                this.setState({result: response['data']})
                this.setState({diffText: this.state.result})
            }, (error) => {
                console.log(error)
                alert(error)
            });
    }
	
	handleClick3() {
        axios.get('http://www.4424081204.com/node')
            .then((response) => {
                console.log(response)
            }, (error) => {
                console.log(error)
                alert(error)
            });
    }
	
	handleClick4() {
        axios.get('http://www.4424081204.com/node/test')
            .then((response) => {
                console.log(response)
            }, (error) => {
                console.log(error)
                alert(error)
            });
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

            <div>
                <NavBar/>
                <div className="ReviewCreator">
                    {this.props.children}
                    <button onClick={(e) => this.handleClick1()}>
                        Set minimal diff
                    </button>
                    <button onClick={(e) => this.handleClick2()}>
                        Set full diff
                    </button>
					<button onClick={(e) => this.handleClick3()}>
						node test
					</button>
					<button onClick={(e) => this.handleClick4()}>
						node test 2
					</button>
                    <br/>
                    <button onClick={(e) => this.createDiff()}>
                        Create Diff
                    </button>
                    <button onClick={(e) => this.clearDiffs()}>
                        Clear Diffs
                    </button>
                    <div style={{padding: 10, marginBottom: 300}}>
                        {this.state.diffList}
                    </div>
                </div>
            </div>
        );
    }
}

ReviewCreator.propTypes = {
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node,
};

export default ReviewCreator;