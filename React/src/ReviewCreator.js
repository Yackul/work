import React from 'react';
import PropTypes from 'prop-types';
import axios from "axios";
import DiffDisplay from './DiffDisplay';
import NavBar from './NavBar'

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
        axios.post('http://ec2-35-164-105-133.us-west-2.compute.amazonaws.com/min_diff', {
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
        axios.post('http://ec2-35-164-105-133.us-west-2.compute.amazonaws.com/full_diff', {
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
                <NavBar/>
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