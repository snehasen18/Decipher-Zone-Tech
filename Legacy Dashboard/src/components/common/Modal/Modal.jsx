import React from 'react';
import './Modal.css';

class Modal extends React.Component {
  componentDidMount() {
    document.addEventListener('keydown', this.handleEsc);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleEsc);
  }

  handleEsc = (e) => {
    if (e.key === 'Escape') this.props.onClose();
  };

  render() {
    const { isOpen, onClose, title, children } = this.props;
    if (!isOpen) return null;

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-box fade-in" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>{title}</h3>
            <button className="modal-close" onClick={onClose}>×</button>
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    );
  }
}

export default Modal;