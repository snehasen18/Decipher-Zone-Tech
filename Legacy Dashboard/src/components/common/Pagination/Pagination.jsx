import React from 'react';
import './Pagination.css';

class Pagination extends React.Component {
  render() {
    const { currentPage, totalPages, onPageChange } = this.props;
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
      <div className="pagination">
        <button
          className="page-btn"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          ‹
        </button>
        {pages.map((p) => (
          <button
            key={p}
            className={`page-btn ${p === currentPage ? 'active' : ''}`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}
        <button
          className="page-btn"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          ›
        </button>
      </div>
    );
  }
}

export default Pagination;