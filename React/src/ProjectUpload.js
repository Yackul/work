import React from 'react';
import PropTypes from 'prop-types';
import axios from "axios";

class ProjectUpload extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            packageFile: "",
            diffFile: ""
        };
    }

    setFile = async (e) => {
        e.preventDefault()
        const file = e.target.files[0]
        const reader = new FileReader()
        const scope = this
        reader.onload = function () {
            const text = reader.result
        }
        reader.readAsText(file)
        this.setState({
            packageFile: file,
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
            maxWidth: 500,
            minHeight: 100,
            margin: '0 auto',
            padding: 30,
            flex: 1,
        };

        return (
            <div className="backdrop" style={backdropStyle}>
                <div className="ProjectUpload" style={modalStyle}>
                    {this.props.children}
                    <input type="file" onChange={(e) => this.setFile(e)} />
                    <button onClick={this.props.onClose}>
                        Close
                    </button>
                    <button onClick={(e) => this.showFile()}>
                        Upload
                    </button>
                    <p>{this.state.packageFile.name}</p>
                </div>
            </div>
        );
    }
}

ProjectUpload.propTypes = {
    onClose: PropTypes.func.isRequired,
    show: PropTypes.bool,
    children: PropTypes.node
};

export default ProjectUpload;