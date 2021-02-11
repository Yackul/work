import React from 'react';
import './index.css';
import logo from './GitGoing.jpeg';
import { Auth } from 'aws-amplify';

class ProfilePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      authState: 'loading',
      UName: Auth.currentAuthenticatedUser
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount = async () => {
    try {
      await Auth.currentAuthenticatedUser()
      this.setState({ authState: 1 })
    } catch (err) {
      this.setState({ authState: 'unauthorized' })
    }
  }

  signOut = async () => {
    try {
      await Auth.signOut();
    } catch (error) {
      console.log('error signing out: ', error);
    }
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
            <div className="pill-nav">
              <img src={logo} alt="avatar2" className="avatar2" />
              <a href="/Home">Home</a>
              <a href="/Me">My Profile</a>
              <a href="/Projects">My Projects</a>
              <a href="/ProjectsTest">GET TEST</a>
            </div>
            <h2>Im a profile!</h2>
            <input type="submit" className="submit" onClick={this.signOut} value="Sign Out" />
                      

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