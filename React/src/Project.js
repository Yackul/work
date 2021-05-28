import React, {Component} from 'react';
import './App.css';
import PropTypes from 'prop-types';
import ProjectUpload from './ProjectUpload'
import {Auth} from 'aws-amplify'
import NavBar from './NavBar'
import DiffLine from './DiffLine';


class Project extends React.Component {

    constructor(props) {
        super(props)
        this.state = {

            lineArray: [],
            lineComponent: [],
            diffText: 'The boy kicked the ball. \n The girl hit the ball. \n The dog chased the ball.',
            lineArrayLength: 0,
            commentIndex: 0,
            showText: false,
            comment: 'this is a comment',
            showComment: false,
            isOpen: false

        };

        this.indexthis = this.indexthis.bind(this)

    }
    indexthis = async () => {
        try {
            this.setState({lineArray: this.state.diffText.split(/\r?\n/),
            lineArrayLength: this.state.lineArray.length}, () => {
                this.setState({
                    lineComponent: this.state.lineComponent.concat(
                        <div>{this.state.lineArray.map((line, index) => {
                            return <div>
                                <DiffLine

                                    lineText={line}
                                    lineIndex={index + 1}
                                    showComment={this.state.isOpen}>

                                </DiffLine>
                            </div>
                        })}
                        </div>
                    )
                })
            })
        } catch (err) {
            alert(err)
        }
    }

    toggleModal = () => {
        this.setState({isOpen: !this.state.isOpen});
    }

    handleSubmit(evt) {
        evt.preventDefault();
    }

    componentDidMount = async () => {
        console.log('componentDidMount called')
        try {
            await Auth.currentAuthenticatedUser()
            this.setState({authState: 1})
        } catch (err) {
            this.setState({authState: 'unauthorized'})
        }
        console.log(this.state.authState)
    }


    render() {
        switch (this.state.authState) {
            case ('loading'):
                return <h1>Loading</h1>
            case (1):
                return (
                    <div>
                        <div className='test2'><NavBar/></div>

                        <button onClick={this.toggleModal}>
                            Create a new project
                        </button>

                        <ProjectUpload show={this.state.isOpen}
                                       onClose={this.toggleModal}>
                        </ProjectUpload>

                        <p>{this.state.diffText}</p>

                        <button onClick={this.indexthis}>return indexing</button>

                        <p style={{margin: 1}}> Size of lineArray: {this.state.lineArray.length} </p>
                        <p style={{margin: 1}}> Size of lineComponent: {this.state.lineComponent.length} </p>

                        <div>
                            {this.state.lineComponent}
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

Project.propTypes = {
    onClose: PropTypes.func,
    showComment: PropTypes.bool,
    children: PropTypes.node,
    diffText: PropTypes.string
};

export default Project;