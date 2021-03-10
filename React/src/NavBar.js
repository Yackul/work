import React from "react";
import logo from './GitGoing.jpeg';
import { Auth } from 'aws-amplify'


class NavBar extends React.Component{

    signOut = async () => {
        try {
          await Auth.signOut();
        } catch (error) {
          console.log('error signing out: ', error);
        }
      }

    render(){
        return(
            <div className="pill-nav">
                <img src={logo} alt="avatar2" className="avatar2" />
                <a href="/Home">Home</a>
                <a href="/Me">My Profile</a>
                <a href="/Projects">My Projects</a>
                <a href="/Review">Review (Beta)</a>
                <a href="/CommentTest">Comments (Beta)</a>
                <a href='/' onClick={this.signOut}>Sign Out</a>
            </div>

        )
    }
}

export default NavBar