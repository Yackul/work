import React from 'react';

export default class Content extends React.Component {
  state = {
    editable: false
  }

  componentDidMount() {
    if (this.state.editable) this.contentContainer.focus();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.editable && this.state.editable) {
      this.contentContainer.focus();
    }
  }

  bubbleUpEditableSelectedRegion = (e) => {
    const arrowEvents = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'];
    if (arrowEvents.includes(e.key) && e.shiftKey) {
      this.bubbleUpSelectedRegion(e);
    }
  }

  bubbleUpSelectedRegion = (e) => {
    const { setBtnsGroupPosition, showButtonsGroup } = this.props;

    const selection = window.getSelection();

    if (selection.toString()) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      setBtnsGroupPosition(rect);
      showButtonsGroup();
    }
  }

  toggleEditMode = () => {
    this.setState({ editable: !this.state.editable });
  }

  render() {
    const editButtonStyles = {
      fontSize: '20px',
      border: 'none',
      background: 'transparent',
      position: 'fixed',
      left: '75%' // <= 100% - App.style.paddingRight(25%)
    }

    const contentSectionStyles = {
      textAlign: 'justify',
      background: '#fff',
      padding: '20px'
    }

    return (
      <div>
        <button style={editButtonStyles} onClick={this.toggleEditMode}>
          &#x270D;{` edit mode${this.state.editable ? ' on' : ' off'}`}
        </button>

        <section
          ref={(elm) => { this.contentContainer = elm; }}
          contentEditable={this.state.editable}
          style={contentSectionStyles}
          onMouseUp={this.bubbleUpSelectedRegion}
          onMouseMove={this.bubbleUpSelectedRegion}
          onKeyUp={this.bubbleUpEditableSelectedRegion}
        >
          <h1 style={{ textAlign: 'center' }}>
            Project 1
          </h1>

          <p>      public class Factorial
            {'{'}
          </p>

          <p>
            public static void main(String[] args)
           
          </p>

          <p>
               {'{'}             final int NUM_FACTS = 100;
          </p>
          <p>
            System.out.println( i + "! is " + factorial(i));
            
          </p>
          <p>
	            {'}'}

          </p>

        </section>
      </div>
    );
  }
}
