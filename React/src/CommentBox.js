import React, {Component} from 'react';
import './CommentBox.css';
import {Auth} from 'aws-amplify'
import {number} from "prop-types";

class CommentBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            commentId: 0,
            Uname: ''
        };
    }

    componentDidMount = async () => {
        const tokens = await Auth.currentSession();
        const userName = tokens.getIdToken().payload['cognito:username'];
        var userNameHold = userName.charAt(0).toUpperCase() + userName.slice(1);
        this.setState({Uname: userNameHold})
    }

    handleOnSubmit(commentText) {
        let newCommentId = this.state.commentId + 1;
        this.setState({commentId: newCommentId});
        let comment = {id: this.state.commentId, author: this.state.Uname, text: commentText}
        this.setState({comments: this.state.comments.concat(comment)});
        this.props.close()
    }

    render() {
        return (
            <div>
                <CommentList comments={this.state.comments}/>
                <CommentInput lineIndex={this.props.lineIndex} updateLine={this.props.updateLine}
                              onCommentSubmit={this.handleOnSubmit.bind(this)} Uname={this.state.Uname}/>
            </div>
        );
    }
}


class CommentInput extends Component {

    handleOnSubmit(e) {
        let commentText = this.textInput.value;
        if (commentText) {
            this.props.updateLine(this.props.Uname, commentText, this.props.lineIndex - 1)
            this.props.onCommentSubmit(commentText);
            this.textInput.value = '';
        }
    }

    render() {
        return (
            <div>

                <textarea
                    className="comment-box__text-area"
                    placeholder="Add your comment"
                    ref={(ref) => this.textInput = ref} type="text">

                </textarea>
                <br/>
                <button onClick={this.handleOnSubmit.bind(this)} className="comment-box__submit-button">Submit</button>
            </div>
        );
    }
}

class CommentList extends Component {
    render() {
        let liComments = this.props.comments.map(function (comment) {
            return <Comment key={comment.id} author={comment.author} text={comment.text}/>;
        })
        return (
            <ul className="CommentList">
                {liComments}
            </ul>
        );
    }
}

class Comment extends Component {
    render() {
        return (
            <li key={this.props.id} className="Comment">
                {this.props.author}: {this.props.text}
            </li>
        );
    }
}

Comment.propTypes = {
    lineIndex: number
}

export default CommentBox;