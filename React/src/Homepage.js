import React from 'react';
import './index.css';
import ReviewCreator from './ReviewCreator'
import logo from './GitGoing.jpeg';
import PropTypes from 'prop-types';

class Homepage extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isOpen: false,
          };
    }

    toggleModal = () => {
        this.setState({isOpen: !this.state.isOpen});
    }

    render() {

      if(localStorage.LoggedIn !== 'true') {
        window.location = "/"
      }

        return (    
            <div> 
                <div className="pill-nav">
                    <img src={logo} alt="avatar2" className="avatar2" />
                    <a href="/Home">Home</a>
                    <a href="/Me">My Profile</a>
                    <a href="/MyProjects">My Projects</a>
                </div>
                <br></br>
                <h1>Welcome to Git Going!</h1>
                <p> Provide us a repo path and file name through a JSON file with the create button below, and we'll give you a diff!</p>
                 <button onClick={this.toggleModal}>
                    Create Code Review
                </button>
                <br></br>
                <ReviewCreator show={this.state.isOpen}
                       onClose={this.toggleModal}>
                </ReviewCreator>
            </div>
          );
    }
}

Homepage.propTypes = {
    onClose: PropTypes.func.isRequired,
    show: PropTypes.bool,
    children: PropTypes.node
};

export default Homepage