import React from 'react';
import PropTypes from 'prop-types';
import Comment from './CommentBox'

class DiffLine extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            showComment: props.showComment,
            lineArray: [],
            comments: []
        };
        this.open = this.open.bind(this)
        this.close = this.close.bind(this)
    }


    open = () => {
        this.setState({ showComment: true });
    };

    close() {
        this.setState({ showComment: false })
    }

    render() {

        if (this.state.showComment) {
            return (

                <div>
                <button className="submit3" onClick={(e) => this.close()}> {this.props.lineIndex}</button>
                    <text style={{color: this.props.color}}>{this.props.lineText}</text>
                <Comment updateLine={this.props.updateLine} lineIndex={this.props.lineIndex} open={this.open} close={this.close}/>

            </div>
            );
        } else {
            return (<div>
                <button className="submit3" onClick={this.open}> {this.props.lineIndex}</button>
                <text style={{color: this.props.color}}>{this.props.lineText}</text>
            </div>
            )
        }

    }
}

DiffLine.propTypes = {
    onClose: PropTypes.func,
    showComment: PropTypes.bool,
    children: PropTypes.node,
    diffText: PropTypes.string,
    lineText: PropTypes.string,
    lineIndex: PropTypes.number,
    color: PropTypes.string
};

export default DiffLine;