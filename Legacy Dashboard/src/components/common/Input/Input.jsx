import React from 'react';
import './Input.css';

class Input extends React.Component {
  render() {
    const { label, type = 'text', value, onChange, name, placeholder, error, icon } = this.props;
    return (
      <div className="input-group">
        {label && <label className="input-label">{label}</label>}
        <div className={`input-wrapper${icon ? ' has-icon' : ''}${error ? ' has-error' : ''}`}>
          {icon && <span className="input-icon">{icon}</span>}
          <input
            className="input-field"
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
          />
        </div>
        {error && <span className="input-error-text">{error}</span>}
      </div>
    );
  }
}

export default Input;