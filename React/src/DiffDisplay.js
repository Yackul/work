import React from 'react';
import PropTypes from 'prop-types';
import DiffLine from "./DiffLine";
import Comment from "./Comment";
import { Auth } from 'aws-amplify';
import Cookies from 'js-cookie';
import axios from 'axios';
import './index.css';

class DiffDisplay extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            CookieSave: "",
            routeID: this.props.FID,
            show: props.isOpen,
            lineArray: [],
            lineComponent: [],
            commentDict: {},
            lineArrayLength: 0,
            commList: [],
            splitLeft: [],
            endComponent1: " ",
            splitRight: [],
            multiIndex1: ''
        };
        this.updateLine = this.updateLine.bind(this)
    }

    updateLine(uname, comment, index, split) {
        let d = this.state.commentDict
        let i = index
        let c = uname + ': ' + comment
        if (!d[i]) {
            d[i] = [];
        }
        d[i].push(<Comment PID={this.props.PID} FID={this.props.FID} isOpen={false} comment={c} splitSide={split}/>)
        this.setState({commentDict: d})
    }

    componentDidMount = async () => {
        try {
            await this.setState({ lineArray: this.props.diffText.split(/\r?\n/) })
            await this.setState({ lineArrayLength: this.state.lineArray.length })
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
            this.setState({ splitLeft: left, splitRight: right })
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
            headers: { accesstoken: this.state.CookieSave }
        }).then(res => {
            var x
            for (var i = 0; i < res.data.length; i++) {
                x = i
                hld2[x] = res.data[x]
            }
            this.setState({
                commList: hld2
            })
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
            this.setState({commentDict: this.state.commentDict})
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
        this.setState({ show: true })
    }

    close() {
        this.setState({ show: false })
    }

    selectionFunction = () => {


        if (window.getSelection().toString() == "") {
            alert("Please highlight text")
        }
        else {

            let selection = window.getSelection().getRangeAt(0)
            let sel = window.getSelection();
            let range = sel.getRangeAt(0);
            document.designMode = "on";
            sel.removeAllRanges();
            sel.addRange(range);

            this.setState({ testComponent: <div> {selection.toString()} </div> })
            let endNode = selection.endContainer
            let endNode1 = endNode.nodeValue
            this.setState({ endComponent1: endNode1 })
            this.setState({
                lineComponent: this.state.lineComponent.concat(
                    <div>{this.state.lineArray.map((line, index) => {
                        this.setState({ lineText: line })
                        if (line == this.state.endComponent1) {
                            this.setState({ multiIndex1: index + 1 })
                            // Colorize text
                            document.execCommand("BackColor", false, "#469AFC");
                            document.designMode = "off";
                        }

                    })}
                    </div>
                )
            })
        }
    };

    render() {

        const openDiff = {
            display: 'flex',
            backgroundColor: '#fce8c6',
            padding: 5,
            paddingLeft: 10,
            borderStyle: 'solid',
            borderWidth: 2,
            margin: 5,
            paddingRight: 20,
        };

        const closedDiff = {
            backgroundColor: '#fce8c6',
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

        const toggleTextMinus = {
            fontWeight: 'bold',
            fontSize: 18,
            fontFamily: 'Courier New',
            cursor: 'pointer',
            paddingRight: 5
        };

        const toggleTextPlus = {
            fontWeight: 'bold',
            fontSize: 18,
            fontFamily: 'Courier New',
            cursor: 'pointer',
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

        const splitHalf = {
            flex: 1,
            minWidth: 0,
            overflowX: 'scroll',
            border: 'inset',
            borderWidth: 2
        }

        if (this.state.show) {
            return (

                <div className="DiffDisplay" style={openDiff}>
                    <text style={toggleTextMinus} onClick={(e) => this.close()}>-</text>
                    <button className="submit_delete" onClick={this.selectionFunction}>
                        MultiComment
                    </button>

                    {this.props.isSplit == false &&
                        <div>
                            {this.state.lineArray.map((line, index) => {
                                let side = "none"
                                if (line.charAt(0) === '+') {
                                    if ((index + 1) == this.state.multiIndex1) {
                                        return <div>
                                            <DiffLine

                                                PID={this.props.PID}
                                                FID={this.props.FID}
                                                color={'#038A30'}
                                                updateLine={this.updateLine}
                                                lineText={line}
                                                lineIndex={index + 1}
                                                showComment={false}
                                                multiCommentIndex={this.state.multiIndex1}
                                                splitSide={side}>
                                            </DiffLine>
                                            {this.state.commentDict[index] && this.state.commentDict[index][0].props.splitSide === side && this.state.commentDict[index].map(comment => <div
                                                key={comment}> {comment} </div>)}
                                        </div>
                                    }
                                    else {
                                        return <div>
                                            <DiffLine

                                                PID={this.props.PID}
                                                FID={this.props.FID}
                                                color={'#038A30'}
                                                updateLine={this.updateLine}
                                                lineText={line}
                                                lineIndex={index + 1}
                                                multiCommentIndex={''}
                                                showComment={false}
                                                splitSide={side}>
                                            </DiffLine>
                                            {this.state.commentDict[index] && this.state.commentDict[index][0].props.splitSide === side && this.state.commentDict[index].map(comment => <div
                                                key={comment}> {comment} </div>)}
                                        </div>
                                    }

                                } else if (line.charAt(0) === '-') {
                                    if ((index + 1) == this.state.multiIndex1) {
                                        return <div>
                                            <DiffLine

                                                PID={this.props.PID}
                                                FID={this.props.FID}
                                                color={'#EB0E0E'}
                                                updateLine={this.updateLine}
                                                lineText={line}
                                                lineIndex={index + 1}
                                                showComment={false}
                                                multiCommentIndex={this.state.multiIndex1}
                                                splitSide={side}>

                                            </DiffLine>
                                            {this.state.commentDict[index] && this.state.commentDict[index][0].props.splitSide === side && this.state.commentDict[index].map(comment => <div
                                                key={comment}> {comment} </div>)}
                                        </div>
                                    }
                                    else {
                                        return <div>
                                            <DiffLine

                                                PID={this.props.PID}
                                                FID={this.props.FID}
                                                color={'#EB0E0E'}
                                                updateLine={this.updateLine}
                                                lineText={line}
                                                lineIndex={index + 1}
                                                multiCommentIndex={''}
                                                showComment={false}
                                                splitSide={side}>

                                            </DiffLine>
                                            {this.state.commentDict[index] && this.state.commentDict[index][0].props.splitSide === side && this.state.commentDict[index].map(comment => <div
                                                key={comment}> {comment} </div>)}
                                        </div>

                                    }
                                } else {
                                    if ((index + 1) == this.state.multiIndex1) {
                                        return <div>
                                            <DiffLine

                                                PID={this.props.PID}
                                                FID={this.props.FID}
                                                updateLine={this.updateLine}
                                                lineText={line}
                                                lineIndex={index + 1}
                                                showComment={false}
                                                multiCommentIndex={this.state.multiIndex1}
                                                splitSide={side}>

                                            </DiffLine>
                                            {this.state.commentDict[index] && this.state.commentDict[index][0].props.splitSide === side && this.state.commentDict[index].map(comment => <div
                                                key={comment}> {comment} </div>)}
                                        </div>
                                    }
                                    else {
                                        return <div>
                                            <DiffLine

                                                PID={this.props.PID}
                                                FID={this.props.FID}
                                                updateLine={this.updateLine}
                                                lineText={line}
                                                lineIndex={index + 1}
                                                showComment={false}
                                                multiCommentIndex={''}
                                                splitSide={side}>

                                            </DiffLine>
                                            {this.state.commentDict[index] && this.state.commentDict[index][0].props.splitSide === side && this.state.commentDict[index].map(comment => <div
                                                key={comment}> {comment} </div>)}
                                        </div>

                                    }
                                }
                            })}
                        </div>}

                    {this.props.isSplit == true &&
                    <div style={{display: 'inline-flex', overflowX: 'auto'}}>
                        <div style={splitHalf}>{this.state.splitLeft.map((line, index) => {
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
                        <div style={splitHalf}>{this.state.splitRight.map((line, index) => {
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
                    <text style={toggleTextPlus} onClick={(e) => this.open()}>+</text>
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
