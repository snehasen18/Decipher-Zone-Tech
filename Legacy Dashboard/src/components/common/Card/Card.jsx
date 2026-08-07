import React from 'react';
import './Card.css';

class Card extends React.Component {
  render() {
    const { children, className = '', noPadding, hoverable } = this.props;
    return (
      <div className={`card ${noPadding ? 'card-no-padding' : ''} ${hoverable ? 'card-hoverable' : ''} ${className}`}>
        {children}
      </div>
    );
  }
}

export default Card;