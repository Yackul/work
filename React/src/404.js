import React from 'react';
import './index.css';
//import ReviewCreator from './ReviewCreator'
import NavBar from './NavBar'


class Err extends React.Component {

    render() {

        return(
            <div>
                <div className='test2'><NavBar/></div>
            <div>
                Sorry, something went wrong!
                This page should have a neat logo eventually. Or something.
            </div>
            </div>
        )
    }
}


export default Err