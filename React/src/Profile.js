import React from 'react';
import './index.css';
import NavBar from './NavBar'
import { Auth } from 'aws-amplify';

class ProfilePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      authState: 'loading',
      Uname: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount = async () => {
    console.log('componentDidMount calledHP')
    try {
      await Auth.currentAuthenticatedUser()
      const tokens = await Auth.currentSession();
      const userName = tokens.getIdToken().payload['cognito:username'];
      var userNameHold = userName.charAt(0).toUpperCase() + userName.slice(1);
      this.setState({
        authState: 1,
        Uname: userNameHold
      })
    } catch (err) {
      this.setState({ authState: 'unauthorized' })
    }
    //console.log(this.state.authState)
  }


  handleSubmit(evt) {
    evt.preventDefault();
  }
  render() {

    switch (this.state.authState) {
      case ('loading'):
        return <h1>Loading</h1>
      case (1):
        return (
          <div>
            <NavBar />
            <h2>You are: {this.state.Uname}</h2>


          </div>

        );
      case ('unauthorized'):
        return window.location = "/"
      default:
        return null
    }



  }
}

export default ProfilePage