import React from 'react';
import './Loader.css';

class Loader extends React.Component {
  render() {
    const { variant = 'spinner', rows = 3, label } = this.props;

    if (variant === 'skeleton') {
      return (
        <div className="skeleton-wrap">
          {Array.from({ length: rows }).map((_, i) => (
            <div className="skeleton-line" key={i} style={{ width: `${85 - i * 10}%` }} />
          ))}
        </div>
      );
    }

    return (
      <div className="loader-wrap">
        <div className="spinner" />
        {label && <p className="loader-label">{label}</p>}
      </div>
    );
  }
}

export default Loader;