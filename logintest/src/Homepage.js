import React from 'react';
import './index.css';
import logo from './GitGoing.jpeg';


class HomePage extends React.Component {
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
        <h2>do stufffffffffffffff</h2>
        <h2>do stufffffffffffffff</h2>
        <h2>do stufffffffffffffff</h2>
        <h2>do stufffffffffffffff</h2>
        <h2>do stufffffffffffffff</h2>
        <h2>do stufffffffffffffff</h2>
        <h2>do stufffffffffffffff</h2>
        <h2>do stufffffffffffffff</h2>
        <h2>do stufffffffffffffff</h2>
        <h2>do stufffffffffffffff</h2>
        <h2>do stufffffffffffffff</h2>
        <h2>do stufffffffffffffff</h2>
        <h2>do stufffffffffffffff</h2>
        <h2>do stufffffffffffffff</h2>
        <h2>do stufffffffffffffff</h2>
        <h2>do stufffffffffffffff</h2>
        <h2>do stufffffffffffffff</h2>
        <h2>do stufffffffffffffff</h2>
           <h1>hihihihihihih</h1>
           <input type ="file" onChange={(e) => this.showFile(e)} />
           </div>
          
        
      );
    }
  }

  export default HomePage