import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {
  render() {
    const { value, onChange, placeholder = 'Search...' } = this.props;
    return (
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          className="search-input"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      </div>
    );
  }
}

export default SearchBar;