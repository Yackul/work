import React from 'react';
import PropTypes from 'prop-types';

class DiffDisplay extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
            show: false,
            lineArray: [],
            lineArrayLength: 0,
            indexPad: '',
            commentIndex: 10,
            comment: 'Test'
        };
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
                this.setState({lineArray: this.props.diffText.split(/\r?\n/)})
                this.setState({lineArrayLength: this.state.lineArray.length})

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
            whitespace: 'pre-wrap',
            backgroundColor: '#FDF5ED',
            padding: 10,
            borderStyle: 'solid',
            borderWidth: 2,
            marginBottom: 10,
            alignSelf: 'center'
        };

        const closedDiff = {
            backgroundColor: '#FDF5ED',
            width: 20,
            height: 20,
            textAlign: 'center',
            borderStyle: 'solid',
            borderWidth: 2,
            marginBottom: 5,
            paddingBottom: 5,
            paddingLeft: 3,
            paddingRight: 3
        };

        const toggleText = {
            fontWeight: 'bold',
            fontSize: 18,
            fontFamily: 'Courier New'
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
                    <p style={diffTextStyle}> Number of lines in diff: {this.state.lineArray.length} </p>
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
                                return <div style={{display: 'flex', columnGap: 20, margin: 1}}>
                                    <p style={diffTextStyle}>{index+1}</p>
                                    <p style={diffTextStyle}>{line}</p>
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
    show: PropTypes.bool,
    children: PropTypes.node,
    diffText: PropTypes.string
};

export default DiffDisplay;