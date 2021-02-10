import React from 'react';
import './index.css';
import ReviewCreator from './ReviewCreator'
import logo from './GitGoing.jpeg';
import PropTypes from 'prop-types';
import { Auth } from 'aws-amplify'


class Homepage extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isOpen: false,
            authState: 'loading'
        };
    }

    componentDidMount = async () => {
        try {
            await Auth.currentAuthenticatedUser()
            this.setState({ authState: 1 })
        } catch (err) {
            this.setState({ authState: 'unauthorized' })
        }
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
                            <a href="/Review">Review (Beta)</a>
                        </div>
                        <br></br>
                        <h1>Welcome to Git Going!</h1>
                    </div>
                );
            case ('unauthorized'):
                return window.location = "/"
            default:
                return null
        }
    }
}

Homepage.propTypes = {
    show: PropTypes.bool,
    children: PropTypes.node
};

export default Homepage