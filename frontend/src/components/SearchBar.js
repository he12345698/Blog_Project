// src/components/SearchBar.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/components/SearchBar.module.css'; // 引入 CSS 模組

function SearchBar({ value }) {
  const [query, setQuery] = useState(value || ''); // 用來儲存使用者輸入的搜尋詞
  const navigate = useNavigate();

  // 在 value 更新時，更新 query
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // 處理搜尋提交
  const handleSearch = (e) => {
    e.preventDefault(); // 阻止頁面重新載入
    if (query.trim()) {
      navigate(`/searchPage?query=${encodeURIComponent(query.trim())}`); // 導航到搜尋結果頁面
    } else {
      console.error('搜尋條件不可為空');
      // 可以在這裡顯示一個錯誤消息給用戶
      alert('請輸入搜尋條件');
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSearch} className={styles['search-bar']}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)} // 更新搜尋詞
          placeholder="搜尋文章標題或作者"
        />
        <button type="submit">搜尋</button>
      </form>
    </div>
  );
}

export default SearchBar;
