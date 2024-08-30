import React, { useState } from 'react';
//import '../styles/components/SearchBar.css';
import styles from '../styles/components/SearchBar.module.css';


function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div className={styles.search_bar}>
      <input
        type="text"
        placeholder="搜尋標題或作者"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>搜尋</button>
    </div>
  );
}

export default SearchBar;
