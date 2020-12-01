import React from 'react';
import PropTypes from 'prop-types';

class ReviewCreator extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            packageFile: ''
        };
    }

    setFile = async (e) => {
        e.preventDefault()
        const file = e.target.files[0]
        this.setState({
            packageFile: file
        })
    }

    showFile() {
        const reader = new FileReader();
        reader.onload = function () {
            const text = reader.result
            alert(reader.result)
        };
        reader.readAsText(this.state.packageFile)
    }

    parseDiffPackage() {
        const reader = new FileReader();
        reader.onload = function () {
            const text = reader.result
            alert(text)
        };
        reader.readAsText(this.state.packageFile)
    }

    render() {
        // Render nothing if the "show" prop is false
        if (!this.props.show) {
            return null;
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
            maxWidth: 500,
            minHeight: 100,
            margin: '0 auto',
            padding: 30,
            flex: 1,
        };

        return (
            <div className="backdrop" style={backdropStyle}>
                <div className="ReviewCreator" style={modalStyle}>
                    {this.props.children}
                        <input type ="file" onChange={(e) => this.setFile(e)} />
                        <br></br>
                        <br></br>
                        <button onClick={(e) => this.showFile(e)}>
                            Create Code Review
                        </button>
                        <br></br>
                        <button onClick={this.props.onClose}>
                            Close
                        </button>
                        <p>{this.state.packageFile.name}</p>
                </div>
            </div>
        );
    }
}

ReviewCreator.propTypes = {
    onClose: PropTypes.func.isRequired,
    show: PropTypes.bool,
    children: PropTypes.node
};

export default ReviewCreator;