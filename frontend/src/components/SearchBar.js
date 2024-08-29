// src/components/SearchBar.js
import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSearch = () => {
    // 將搜尋關鍵字傳遞給父組件
    onSearch(query);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="搜尋標題或作者"
      />
      <button onClick={handleSearch}>搜尋</button>
    </div>
  );
};

export default SearchBar;
