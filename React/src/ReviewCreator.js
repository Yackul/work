import React from 'react';
import PropTypes from 'prop-types';
import axios from "axios";
import DiffDisplay from './DiffDisplay'
import logo from "./GitGoing.jpeg";

class ReviewCreator extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            show: false,
            packageFile: '',
            fileName: 'test.txt',
            diffText: '',
            result: '',
            diffList: []
        };
    }

    handleClick1() {
        axios.post('http://localhost:5000/min_diff', {
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

    handleClick2() {
        axios.post('http://localhost:5000/full_diff', {
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
                <div className="pill-nav">
                    <img src={logo} alt="avatar2" className="avatar2"/>
                    <a href="/Home">Home</a>
                    <a href="/Me">My Profile</a>
                    <a href="/Projects">My Projects</a>
                    <a href="/Review">Review (Beta)</a>
                </div>
                <div className="ReviewCreator">
                    {this.props.children}
                    <button onClick={(e) => this.handleClick1()}>
                        Set minimal diff
                    </button>
                    <button onClick={(e) => this.handleClick2()}>
                        Set full diff
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