import React from 'react';
import './index.css';
//import ReviewCreator from './ReviewCreator'
import NavBar from './NavBar'
import PropTypes from 'prop-types';
import { Auth } from 'aws-amplify'


class Homepage extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isOpen: false,
            authState: 'loading',
            Uname: ''
        };
    }

    componentDidMount = async () => {
        console.log('componentDidMount calledHP')
        try {
          await Auth.currentAuthenticatedUser()
          const tokens = await Auth.currentSession();
          const userName = tokens.getIdToken().payload['cognito:username'];
          var userNameHold = userName.charAt(0).toUpperCase() + userName.slice(1);
          this.setState({ authState: 1,
            Uname: userNameHold })
        } catch (err) {
          this.setState({ authState: 'unauthorized' })
        }
        //console.log(this.state.authState)
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
                        <NavBar/>
                        <br></br>
                        <h1>Welcome to Git Going {this.state.Uname}!</h1>
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