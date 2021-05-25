import React from 'react';
import PropTypes from 'prop-types';
import DiffLine from "./DiffLine";
import Comment from "./Comment";
import {Auth} from 'aws-amplify';
import Cookies from 'js-cookie';
import axios from 'axios';

class DiffDisplay extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            CookieSave: "",
            routeID: this.props.FID,
            show: props.isOpen,
            lineArray: [],
            commentDict: {},
            lineArrayLength: 0,
            commList: [],
            splitLeft: [],
            splitRight: []
        };
        this.updateLine = this.updateLine.bind(this)
    }

    updateLine(uname, comment, index) {
        let d = this.state.commentDict
        let i = index
        let c = uname + ': ' + comment
        if (!d[i]) {
            d[i] = [];
        }
        d[i].push(<Comment PID={this.props.PID} FID={this.props.FID} isOpen={false} comment={c}/>)
        this.setState({commentDict: d})

    }

    componentDidMount = async () => {
        try {
            await this.setState({lineArray: this.props.diffText.split(/\r?\n/)})
            await this.setState({lineArrayLength: this.state.lineArray.length})
        } catch (err) {
            alert(err)
        }

        try {
            let left = []
            let right = []
            this.state.lineArray.map((line, index) => {

                if (line.charAt(0) === '+') {
                    right[index] = line
                    left[index] = ""
                } else if (line.charAt(0) === '-') {
                    left[index] = line
                    right[index] = ""
                } else {
                    left[index] = line
                    right[index] = line
                }
            })
            this.setState({splitLeft: left, splitRight: right})
        } catch (err) {
            alert(err)
        }

        const tokens = await Auth.currentSession();
        document.cookie = "clientaccesstoken=" + tokens.getAccessToken().getJwtToken() + ';';
        const temp = Cookies.get('clientaccesstoken')
        this.setState({
            CookieSave: temp
        })


        const COMMID = this.state.routeID;
        var hld2 = [];

        await axios.get("http://localhost:3002/COMMENTS_ON_REVIEWS/" + COMMID, {
            headers: {accesstoken: this.state.CookieSave}
        }).then(res => {
            var x
            for (var i = 0; i < res.data.length; i++) {
                x = i
                hld2[x] = res.data[x]
            }
            this.setState({
                commList: hld2
            })
            // console.log(res.data[0].COMM)
        }).catch(error => {
            console.log(error);
        });
        var x
        for (var j = 0; j < this.state.commList.length; j++) {
            x = j
            if (!this.state.commentDict[this.state.commList[x].COMMENTINDEX]) {
                this.state.commentDict[this.state.commList[x].COMMENTINDEX] = []
            }
            let side = this.state.commList[x].SplitSide
            this.state.commentDict[this.state.commList[x].COMMENTINDEX].push(<Comment PID={this.props.PID}
                                                                                           FID={this.props.FID}
                                                                                           isOpen={true}
                                                                                           comment={this.state.commList[x].UNameC + ": " + this.state.commList[x].COMM}
                                                                                           splitSide={side}
            />)
        }
    }


    componentDidUpdate = async (prevProps, prevState) => {
        if (prevProps.diffText !== this.props.diffText) {
            try {
                this.setState({
                    lineArray: this.props.diffText.split(/\r?\n/),
                    lineArrayLength: this.state.lineArray.length
                })

            } catch (err) {
                alert(err)
            }
        }
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
            backgroundColor: '#FDF5ED',
            padding: 5,
            paddingLeft: 10,
            borderStyle: 'solid',
            borderWidth: 2,
            margin: 5,
        };

        const closedDiff = {
            backgroundColor: '#FDF5ED',
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
                <div className="DiffDisplay" style={openDiff}>
                    <text style={toggleText} onClick={(e) => this.close()}>-</text>

                    {this.props.isSplit == false &&
                    <div>
                        {this.state.lineArray.map((line, index) => {
                            let side = "none"
                            if (line.charAt(0) === '+') {
                                return <div>
                                    <DiffLine

                                        PID={this.props.PID}
                                        FID={this.props.FID}
                                        color={'#038A30'}
                                        updateLine={this.updateLine}
                                        lineText={line}
                                        lineIndex={index + 1}
                                        showComment={false}
                                        splitSide={side}>

                                    </DiffLine>
                                    {this.state.commentDict[index] && this.state.commentDict[index][0].props.splitSide === side && this.state.commentDict[index].map(comment => <div
                                        key={comment}> {comment} </div>)}
                                </div>
                            } else if (line.charAt(0) === '-') {
                                return <div>
                                    <DiffLine

                                        PID={this.props.PID}
                                        FID={this.props.FID}
                                        color={'#EB0E0E'}
                                        updateLine={this.updateLine}
                                        lineText={line}
                                        lineIndex={index + 1}
                                        showComment={false}
                                        splitSide={side}>

                                    </DiffLine>
                                    {this.state.commentDict[index] && this.state.commentDict[index][0].props.splitSide === side && this.state.commentDict[index].map(comment => <div
                                        key={comment}> {comment} </div>)}
                                </div>
                            } else {
                                return <div>
                                    <DiffLine

                                        PID={this.props.PID}
                                        FID={this.props.FID}
                                        updateLine={this.updateLine}
                                        lineText={line}
                                        lineIndex={index + 1}
                                        showComment={false}
                                        splitSide={side}>

                                    </DiffLine>
                                    {this.state.commentDict[index] && this.state.commentDict[index][0].props.splitSide === side && this.state.commentDict[index].map(comment => <div
                                        key={comment}> {comment} </div>)}
                                </div>
                            }
                        })}
                    </div>}

                    {this.props.isSplit == true &&
                    <div style={{display: 'flex'}}>
                        <div>{this.state.splitLeft.map((line, index) => {
                            let side = "left"
                            if (line.charAt(0) === '+') {
                                return <div>
                                    <DiffLine

                                        PID={this.props.PID}
                                        FID={this.props.FID}
                                        color={'#038A30'}
                                        updateLine={this.updateLine}
                                        lineText={line}
                                        lineIndex={index + 1}
                                        showComment={false}
                                        splitSide={side}>

                                    </DiffLine>
                                    {this.state.commentDict[index] && this.state.commentDict[index][0].props.splitSide === side && this.state.commentDict[index].map(comment => <div
                                        key={comment}> {comment} </div>)}
                                </div>
                            } else if (line.charAt(0) === '-') {
                                return <div>
                                    <DiffLine

                                        PID={this.props.PID}
                                        FID={this.props.FID}
                                        color={'#EB0E0E'}
                                        updateLine={this.updateLine}
                                        lineText={line}
                                        lineIndex={index + 1}
                                        showComment={false}
                                        splitSide={side}>

                                    </DiffLine>
                                    {this.state.commentDict[index] && this.state.commentDict[index][0].props.splitSide === side && this.state.commentDict[index].map(comment => <div
                                        key={comment}> {comment} </div>)}
                                </div>
                            } else {
                                return <div>
                                    <DiffLine

                                        PID={this.props.PID}
                                        FID={this.props.FID}
                                        updateLine={this.updateLine}
                                        lineText={line}
                                        lineIndex={index + 1}
                                        showComment={false}
                                        splitSide={side}>

                                    </DiffLine>
                                    {this.state.commentDict[index] && this.state.commentDict[index][0].props.splitSide === side && this.state.commentDict[index].map(comment => <div
                                        key={comment}> {comment} </div>)}
                                </div>
                            }
                        })}</div>
                        <div>{this.state.splitRight.map((line, index) => {
                            let side = "right"
                            if (line.charAt(0) === '+') {
                                return <div>
                                    <DiffLine

                                        PID={this.props.PID}
                                        FID={this.props.FID}
                                        color={'#038A30'}
                                        updateLine={this.updateLine}
                                        lineText={line}
                                        lineIndex={index + 1}
                                        showComment={false}
                                        splitSide={side}>

                                    </DiffLine>
                                    {this.state.commentDict[index] && this.state.commentDict[index][0].props.splitSide === side && this.state.commentDict[index].map(comment => <div
                                        key={comment}> {comment} </div>)}
                                </div>
                            } else if (line.charAt(0) === '-') {
                                return <div>
                                    <DiffLine

                                        PID={this.props.PID}
                                        FID={this.props.FID}
                                        color={'#EB0E0E'}
                                        updateLine={this.updateLine}
                                        lineText={line}
                                        lineIndex={index + 1}
                                        showComment={false}
                                        splitSide={side}>

                                    </DiffLine>
                                    {this.state.commentDict[index] && this.state.commentDict[index][0].props.splitSide === side && this.state.commentDict[index].map(comment => <div
                                        key={comment}> {comment} </div>)}
                                </div>
                            } else {
                                return <div>
                                    <DiffLine

                                        PID={this.props.PID}
                                        FID={this.props.FID}
                                        updateLine={this.updateLine}
                                        lineText={line}
                                        lineIndex={index + 1}
                                        showComment={false}
                                        splitSide={side}>

                                    </DiffLine>
                                    {this.state.commentDict[index] && this.state.commentDict[index][0].props.splitSide === side && this.state.commentDict[index].map(comment => <div
                                        key={comment}> {comment} </div>)}
                                </div>
                            }
                        })}</div>

                    </div>}
                </div>
            );
        } else {
            return (
                <div className="DiffDisplay" style={closedDiff}>
                    <text style={toggleText} onClick={(e) => this.open()}>+</text>
                </div>
            )
        }
    }
}

DiffDisplay.propTypes = {
    onClose: PropTypes.func,
    isOpen: PropTypes.bool,
    isSplit: PropTypes.bool,
    children: PropTypes.node,
    diffText: PropTypes.string,
    PID: PropTypes.number,
    FID: PropTypes.number
};

export default DiffDisplay;