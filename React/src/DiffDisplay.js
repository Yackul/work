import React from 'react';
import PropTypes from 'prop-types';

class DiffDisplay extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
            lineArray: [],
            lineArrayLength: 0,
            indexPad: '',
            commentIndex: 0,
            comment: ''
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

    render() {

        const diffStyle = {
            whitespace: 'pre-wrap',
            backgroundColor: '#fff',
            maxWidth: 500,
            minHeight: 100,
            padding: 10,
            borderStyle: 'solid',
            marginBottom: 20
        };

        return (
            <div className="DiffDisplay" style={diffStyle}>
                    <p style={{margin: 1}}> Number of lines in diff: {this.state.lineArray.length} </p>
                    <div>
                        {this.state.lineArray.map((line, index) => {
                            if (line.charAt(0) === '+') {
                                return <div style={{display: 'flex', columnGap: 20, margin: 1}}>
                                    <p style={{margin: 1}}>{index+1}</p>
                                    <p style={{margin: 1, color: 'green'}}>{line}</p>
                                </div>
                            } else if (line.charAt(0) === '-') {
                                return <div style={{display: 'flex', columnGap: 20, margin: 1}}>
                                    <p style={{margin: 1}}>{index+1}</p>
                                    <p style={{margin: 1, color: 'red'}}>{line}</p>
                                </div>
                            } else {
                                return <div style={{display: 'flex', columnGap: 20, margin: 1}}>
                                    <p style={{margin: 1}}>{index+1}</p>
                                    <p style={{margin: 1}}>{line}</p>
                                </div>
                            }
                        })}
                    </div>
            </div>
        );
    }
}

DiffDisplay.propTypes = {
    onClose: PropTypes.func,
    show: PropTypes.bool,
    children: PropTypes.node,
    diffText: PropTypes.string
};

export default DiffDisplay;