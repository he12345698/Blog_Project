import React from 'react';
import '../styles/components/SearchBar.css';
const SearchBar = () => {
  return (
    <section className="search-bar">
      <input type="text" placeholder="搜尋..." aria-label="搜尋" />
      <button type="button">搜尋</button>
    </section>
  );
};

export default SearchBar;
