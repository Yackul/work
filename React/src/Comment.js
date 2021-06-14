import PropTypes from "prop-types";
import React from 'react';

class Comment extends React.Component {


    constructor(props) {
        super(props)
        //alert("Comment creation with split side: " + this.props.splitSide)
        this.state = {
            show: props.isOpen
        };
    }

    open() {
        this.setState({show: true})
    }

    close() {
        this.setState({show: false})
    }

    render() {

        const openDiff = {
            display: 'inline-block',
            whiteSpace: 'prewrap',
            backgroundColor: '#F6F3F7',
            padding: 5,
            paddingLeft: 10,
            borderStyle: 'solid',
            borderWidth: 2,
            margin:5,
        };

        const closedDiff = {
            backgroundColor: '#F6F3F7',
            width: 20,
            height: 20,
            textAlign: 'center',
            borderStyle: 'solid',
            borderWidth: 2,
            margin: 5,
            paddingBottom: 5,
            paddingLeft: 3,
            paddingRight: 3
        };

        const toggleText = {
            fontWeight: 'bold',
            fontSize: 18,
            fontFamily: 'Courier New',
            cursor: 'pointer'
        };

        const diffTextStyle = {
            margin: 1,
            fontSize: 14
        }

        diffTextStyle.red = {
            margin: 1,
            fontSize: 14,
            color: '#EB0E0E'
        }

        diffTextStyle.green = {
            margin: 1,
            fontSize: 14,
            color: '#038A30'
        }

        if (this.state.show) {
            return (
                <div className="Comment" style={openDiff}>
                    <text style={toggleText} onClick={(e) => this.close()}>-</text>

                                <div><span style={{color:"#2196F3", fontWeight:"600"}}>{this.props.comment.split(":")[0]}:</span>
                                   {this.props.comment.split(":")[1]}

                                </div>
                </div>
            )
        } else {
            return (
                <div className="Comment" style={closedDiff}><text style = {toggleText} onClick={(e) => this.open()}>+</text></div>
            )
        }
    }
}

Comment.propTypes = {
    onClose: PropTypes.func,
    isOpen: PropTypes.bool,
    children: PropTypes.node,
    comment: PropTypes.string,
    splitSide: PropTypes.string,
    updateLine: PropTypes.func
};

export default Comment;