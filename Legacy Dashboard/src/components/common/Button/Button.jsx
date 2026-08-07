import React from 'react';
import './Button.css';

class Button extends React.Component {
  render() {
    const { children, variant = 'primary', size = 'md', icon, onClick, type = 'button', fullWidth, disabled } = this.props;
    const classes = `btn btn-${variant} btn-${size}${fullWidth ? ' btn-full' : ''}`;
    return (
      <button type={type} className={classes} onClick={onClick} disabled={disabled}>
        {icon && <span className="btn-icon">{icon}</span>}
        {children}
      </button>
    );
  }
}

export default Button;