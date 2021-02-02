import React from 'react';
import PropTypes from 'prop-types';

class DiffDisplay extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
            lineArray: [],
            diffChunks: []
        };
    }

    componentDidMount = async() => {
        try {
            this.setState({lineArray: this.props.diffText.split(/\r?\n/)})
        } catch (err) {
            alert(err)
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.diffText !== this.props.diffText) {
            try {
                this.setState({lineArray: this.props.diffText.split(/\r?\n/)})
            } catch (err) {
                alert(err)
            }
        }
    }

    render() {
        // Render nothing if the "show" prop is false
        if (!this.props.show) {
            return null
        }

        // The gray background
        const backdropStyle = {
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            padding: 50
        };

        // The modal "window"
        const modalStyle = {
            backgroundColor: '#fff',
            borderRadius: 5,
            minHeight: 100,
            maxHeight: 500,
            maxWidth: 800,
            overflowY: 'scroll',
            margin: '0 auto',
            padding: 30,
            flex: 1,
        };

        return (
            <div className="backdrop" style={backdropStyle}>
                <div className="DiffDisplay" style={modalStyle}>
                    {this.props.children}
                    <div style={{whiteSpace: 'pre-wrap'}}>
                        {this.props.diffText}
                        {this.state.lineArray.length}
                    </div>
                    <br></br>
                    <button onClick={this.props.onClose}>
                        Close
                    </button>
                </div>
            </div>
        );
    }
}

DiffDisplay.propTypes = {
    onClose: PropTypes.func.isRequired,
    show: PropTypes.bool,
    children: PropTypes.node,
};

export default DiffDisplay;