import React, { Component } from 'react';
import './CommentBox.css';

class CommentBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            commentId: 0
        };
    }
    handleOnSubmit(commentText) {
        let newCommentId = this.state.commentId + 1;
        this.setState({ commentId: newCommentId });

        let comment = { id: this.state.commentId, author: 'Username', text: commentText }
        this.setState({ comments: this.state.comments.concat(comment) });
    }
    render() {
        return (
            <div>
                <CommentList comments={this.state.comments} />
                <CommentInput onCommentSubmit={this.handleOnSubmit.bind(this)} />
            </div>
        );
    }
}


class CommentInput extends Component {

    handleOnSubmit(e) {
        let commentText = this.textInput.value;
        if (commentText) {
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
                <button onClick={this.handleOnSubmit.bind(this)} className="comment-box__submit-button">Submit</button>
            </div>
        );
    }
}

class CommentList extends Component {
    render() {
        let liComments = this.props.comments.map(function (comment) {
            return <Comment key={comment.id} author={comment.author} text={comment.text} />;
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

export default CommentBox;