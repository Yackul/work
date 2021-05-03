import React, {Component} from 'react';
import './CommentBox.css';
import PropTypes from 'prop-types';
import {Auth} from 'aws-amplify'
import {number} from "prop-types";
import axios from 'axios'
import Cookies from 'js-cookie'

class CommentBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            commentId: 1,
            Uname: '',
            curTime : new Date().toLocaleString(),
            comment: '',
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
                <CommentInput PID={this.props.PID} FID={this.props.FID} lineIndex={this.props.lineIndex} updateLine={this.props.updateLine}
                              onCommentSubmit={this.handleOnSubmit.bind(this)} 
                              Uname={this.state.Uname}/>
            </div>
        );
    }
}


class CommentInput extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            commentId: -1,
            PIDREF: 1,
            FIDREF: 1,
            CookieSave: '',
            Uname: '',
            curTime : new Date().toLocaleString(),
            comment: '',
            authState: 'loading',
            hld: '',
            routePara: -1
        };
    }

    handleOnSubmit(e) {
        let commentText = this.textInput.value;    
        if (commentText) {
            this.props.updateLine(this.props.Uname, commentText, this.props.lineIndex - 1)
            this.props.onCommentSubmit(commentText);
            this.textInput.value = '';
        }
        this.popComment(commentText, this.props.lineIndex)
    }

    componentDidMount = async () => {
        document.body.style.background = "#d0f0f0e1";
        try {
          await Auth.currentAuthenticatedUser()
          const tokens = await Auth.currentSession();          
          const userName = tokens.getIdToken().payload['cognito:username'];
          var userNameHold = userName.charAt(0).toUpperCase() + userName.slice(1);
          document.cookie = "clientaccesstoken="+ tokens.getAccessToken().getJwtToken()+';';
          const temp = Cookies.get('clientaccesstoken')          
          this.setState({ authState: 1,
            Uname: userNameHold,
            CookieSave: temp
         })
        } catch (err) {
          this.setState({ authState: 'unauthorized' })
        }
    }


    //still needs PID and FID someway/somehow
    //Post to comment table ???
    popComment(e, f) {
         axios.post("https://www.4424081204.com:1111/COMMENTS_ON_REVIEWS", {
            PIDREF: this.props.PID,
            FIDREF: this.props.FID,
            COMMENTINDEX: f,
            DT: this.state.curTime,
            COMM: e,            
            UNameC: this.state.Uname,            
        }, {headers: {accesstoken: this.state.CookieSave}}).then(function (res) {
            // console.log(res);
    })
    this.setState({
      step: 1
    });   
}

// handleClick(e) {
//     this.handleOnSubmit();
//     this.popComment();
//   }



    render() {
        return (
            <div>

                <textarea
                    className="comment-box__text-area"
                    placeholder="Add your comment"
                    ref={(ref) => this.textInput = ref} type="text">

                </textarea>
                <br/>
                {/* <button onClick={this.handleOnSubmit.bind(this)} className="comment-box__submit-button">Submit</button> */}
                {/* <input type="submit" className="comment-box__submit-button" value="Submit" onClick={() => {this.handleOnSubmit.bind(this); this.popComment();}}/> */}
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
    lineIndex: number,
    FID: PropTypes.number,
    PID: PropTypes.number
}

export default CommentBox;