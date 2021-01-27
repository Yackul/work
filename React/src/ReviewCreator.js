import React from 'react';
import PropTypes from 'prop-types';
import axios from "axios";
import DiffDisplay from './DiffDisplay'

class ReviewCreator extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isOpen: false,
            packageFile: "",
            diffText: '',
            result: ''
        };
    }

    toggleModal = () => {
        this.setState({isOpen: !this.state.isOpen});
    }

    setFile = async (e) => {
        e.preventDefault()
        const file = e.target.files[0]
        const reader = new FileReader()
        const scope = this
        reader.onload = function () {
            const text = reader.result
            try {
                let result = JSON.parse(text.toString())
                scope.setState({
                    fileName: result.reviewInfo.fileName
                })
            } catch (err) {
                alert(err)
            }
        }
        reader.readAsText(file)
        this.setState({
            packageFile: file,
        })
    }

    handleClick1() {
        axios.post('http://localhost:5000/min_diff', {
            repoPath: this.state.packageFile,
            fileName: this.state.fileName
        })
            .then((response) => {
                console.log(response)
                this.state.result = response['data']
                this.state.diffText = this.state.result
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
                this.state.diffText = response['data']
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

    render() {
        // Render nothing if the "show" prop is false
        if (!this.props.show) {
            return null
        }

        // The gray background
        const backdropStyle = {
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            padding: 50,
        };

        // The modal "window"
        const modalStyle = {
            backgroundColor: '#fff',
            borderRadius: 5,
            maxWidth: 500,
            minHeight: 100,
            margin: '0 auto',
            padding: 30,
            flex: 1,
        };

        return (
            <div className="backdrop" style={backdropStyle}>
                <div className="ReviewCreator" style={modalStyle}>
                    {this.props.children}
                    <input type="file" onChange={(e) => this.setFile(e)}/>
                    <br></br>
                    <br></br>
                    <button onClick={(e) => this.handleClick1()}>
                        Set minimal diff
                    </button>
                    <button onClick={(e) => this.handleClick2()}>
                        Set full diff
                    </button>
                    <br></br>
                    <button onClick={this.toggleModal}>
                        Display Diff
                    </button>
                    <DiffDisplay show={this.state.isOpen}
                                 onClose={this.toggleModal}
                                 diffText={this.state.diffText}>
                    </DiffDisplay>
                    <br></br>
                    <button onClick={this.props.onClose}>
                        Close
                    </button>
                    <p>{this.state.packageFile.name}</p>
                </div>
            </div>
        );
    }
}

ReviewCreator.propTypes = {
    onClose: PropTypes.func.isRequired,
    show: PropTypes.bool,
    children: PropTypes.node,
};

export default ReviewCreator;