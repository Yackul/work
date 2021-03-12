import React from 'react';
import PropTypes from 'prop-types';
import Comment from './CommentBox'

class DiffLine extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            showComment: false,
            lineArray: [],
            lineIndex: '',
            lineText: ''
        };
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
                {this.props.lineText}
                <Comment />

            </div>
            );
        } else {
            return (<div>
                <button className="submit3" onClick={this.open}> {this.props.lineIndex}</button>
                {this.props.lineText}

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
    lineText: PropTypes.string
};

export default DiffLine;