import React from 'react';
import './index.css';
//import ReviewCreator from './ReviewCreator'
import NavBar from './NavBar'


class Err extends React.Component {

    componentDidMount(){
        document.body.style.background = "#F5F5DC";
    }

    render() {

        return(
            <div>
                <div className='test2'><NavBar/></div>
            <div style={{display:"flex", justifyContent: "center", marginTop: '20px'}}>
                Sorry, something went wrong!
                This page should have a neat logo eventually. Or something.
            </div>
            </div>
        )
    }
}


export default Err