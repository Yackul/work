import React from 'react';
import './index.css';
import ReviewCreator from './ReviewCreator'
import ReactDOM from "react-dom";
import {Link} from "react-router-dom";
import logo from './GitGoing.jpeg';
import PropTypes from 'prop-types';

class Homepage extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isOpen: false,
            file1: '',
            file2: ''
          };
    }

    toggleModal = () => {
        this.setState({isOpen: !this.state.isOpen});
    }

    showFile = async (e) => {
        e.preventDefault() 
        const reader = new FileReader()
        reader.onload = async (e) => {
          const text = (e.target.result)
          console.log(text)
          alert(text)
        };
        reader.readAsText(e.target.files[0])
      }

    render() {

      if(localStorage.LoggedIn !== 'true') {
        window.location = "/"
      }

        return (    
            <div> 
                <div className="pill-nav">
                <img src={logo} alt="avatar2" className="avatar2" />
                <a className="active" href="/Home">Home</a>
                <a href="/Me">My Profile</a>
                <a href="#contact">Contact</a>
                <a href="#about">About</a>
                 </div>
                 <br></br>
                 <button onClick={this.toggleModal}>
                    Create Code Review
                </button>
                <br></br>
                <ReviewCreator show={this.state.isOpen}
                       onClose={this.toggleModal}>
                </ReviewCreator>
                <input type ="file" onChange={(e) => this.showFile(e)} />
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