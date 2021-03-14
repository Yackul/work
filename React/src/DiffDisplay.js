import React from 'react';
import PropTypes from 'prop-types';
import DiffLine from "./DiffLine";

class DiffDisplay extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
            show: props.isOpen,
            lineArray: [],
            commentDict: {},
            lineArrayLength: 0
        };
        this.updateLine = this.updateLine.bind(this)
    }

    updateLine(comment, index) {
        let d = this.state.commentDict
        let i = eval(index)
        d[i] = comment
        this.setState({commentArray: d})
    }

    componentDidMount = async() => {
        try {
            this.setState({lineArray: this.props.diffText.split(/\r?\n/)})
            this.setState({lineArrayLength: this.state.lineArray.length})
        } catch (err) {
            alert(err)
        }
    }

    componentDidUpdate = async(prevProps, prevState) => {
        if (prevProps.diffText !== this.props.diffText) {
            try {
                this.setState({lineArray: this.props.diffText.split(/\r?\n/),
                    lineArrayLength: this.state.lineArray.length})

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
            margin:5,
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
                    <div>
                        {this.state.lineArray.map((line, index) => {
                            if (line.charAt(0) === '+') {
                                return <div style={{display: 'flex', columnGap: 20, margin: 1}}>
                                    <p style={diffTextStyle}>{index+1}</p>
                                    <p style={diffTextStyle.green}>{line}</p>
                                </div>
                            } else if (line.charAt(0) === '-') {
                                return <div style={{display: 'flex', columnGap: 20, margin: 1}}>
                                    <p style={diffTextStyle}>{index+1}</p>
                                    <p style={diffTextStyle.red}>{line}</p>
                                </div>
                            } else {
                                return <div>
                                    <DiffLine

                                        updateLine={this.updateLine}
                                        lineText={line}
                                        lineIndex={index + 1}
                                        showComment={false}>

                                    </DiffLine>
                                    {this.state.commentDict[index]}
                                </div>
                            }
                        })}
                    </div>
                </div>
            );
        } else {
            return (
                <div className="DiffDisplay" style={closedDiff}><text style = {toggleText} onClick={(e) => this.open()}>+</text></div>
            )
        }
    }
}

DiffDisplay.propTypes = {
    onClose: PropTypes.func,
    isOpen: PropTypes.bool,
    children: PropTypes.node,
    diffText: PropTypes.string
};

export default DiffDisplay;