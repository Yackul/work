import React, { Component } from 'react';
import './App.css';
import PropTypes from 'prop-types';
import logo from './GitGoing.jpeg';
import ProjectUpload from './ProjectUpload'
import { Auth } from 'aws-amplify'
import Comment3 from './CommentBox'


class Project extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      lineArray: [],
      diffText: 'The boy kicked the ball. \n The girl hit the ball. \n The dog chased the ball.',
      lineArrayLength: 0,
      indexPad: '',
      commentIndex: 0,
      showText: false,
      comment: 'this is a comment'
    };
    this.indexthis = this.indexthis.bind(this)
  }

  indexthis() {
    try {
      this.setState({ lineArray: this.state.diffText.split(/\r?\n/) })
      this.setState({ lineArrayLength: this.state.lineArray.length })

    } catch (err) {
      alert(err)
    }
  }

  handleClick = () => {
    console.log('Click happened');
    this.setState((state) => ({
      showText: !state.showText  //  Toggle showText
    }))
  }


  handleSubmit(evt) {
    evt.preventDefault();
  }

  componentDidMount = async () => {
    console.log('componentDidMount called')
    try {
      await Auth.currentAuthenticatedUser()
      this.setState({ authState: 1 })
    } catch (err) {
      this.setState({ authState: 'unauthorized' })
    }
    console.log(this.state.authState)
  }

  toggleModal = () => {
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    switch (this.state.authState) {
      case ('loading'):
        return <h1>Loading</h1>
      case (1):
        return (
          <div>
            <div className="pill-nav">
              <img src={logo} alt="avatar2" className="avatar2" />
              <a href="/Home">Home</a>
              <a href="/Me">My Profile</a>
              <a href="/Projects">My Projects</a>
            </div>
            <br></br>

            <button onClick={this.toggleModal}>
              Create a new project
            </button>



            <br></br>


            <ProjectUpload show={this.state.isOpen}
              onClose={this.toggleModal}>
            </ProjectUpload>


            <p>{this.state.diffText}</p>
            <button onClick={this.indexthis}>return indexing</button>
            <p style={{ margin: 1 }}> Number of lines: {this.state.lineArray.length} </p>


            <div>
              {this.state.lineArray.map((line, index) => {
                return <div style={{ display: 'flex', columnGap: 20, margin: 1 }}>
                  <button onClick={this.handleClick} style={{ margin: 1 }}> {index + 1}</button>
                  {(() => {
                    if (this.state.showText) {
                      return <div style={{ display: 'flex', columnGap: 20, margin: 1 }}>

                        <p style={{ margin: 1 }}>{line}</p>
                        {"\n"}
                        <Comment3 />
                      </div>

                    }
                    else {
                      return <div style={{ display: 'flex', columnGap: 20, margin: 1 }}>
                        <p style={{ margin: 1 }}>{line}</p>
                      </div>

                    }
                  })()}





                </div>
              })}
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
  show: PropTypes.bool,
  children: PropTypes.node,
  diffText: PropTypes.string
};

export default Project;
