// src/pages/SearchPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar'; // 引入 SearchBar 元件
import styles from '../styles/pages/SearchPage.module.css'; // 引入 CSS 模組

function SearchPage() {
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query') || '';

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/blog/search?keyword=${encodeURIComponent(query)}&page=${currentPage}&size=10`);
        console.log('搜尋結果:', response.data);

        if (Array.isArray(response.data.content)) {
          setResults(response.data.content);
          setTotalPages(response.data.totalPages);
        } else {
          console.error('API 回應不包含有效的結果數組');
        }
      } catch (error) {
        console.error('獲取搜尋結果失敗:', error);
      }
    };

    fetchResults();
  }, [query, currentPage]);

  const handleSearch = (query) => {
    navigate(`/searchPage?query=${encodeURIComponent(query)}`);
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className={styles.search_page}>
      <SearchBar onSearch={handleSearch} /> {/* 插入 SearchBar */}
      <div className={styles['results-list']}>
        {results.length > 0 ? (
          results.map((result) => (
            <div key={result.article_id} className={styles['result-item']}>
              <div className={styles['result-content']}>
                <span className={styles['result-title']}>{result.title}</span>
                <span className={styles['result-author']}>| 作者: {result.username || '未知作者'}</span>
                <span className={styles['result-updated']}>| 更新時間: {result.last_edited_at}</span>
              </div>
            </div>
          ))
        ) : (
          <p>沒有找到搜尋結果</p>
        )}
      </div>
      <div className={styles.pagination}>
        <button onClick={handlePreviousPage} disabled={currentPage === 0}>
          上一頁
        </button>
        <span>頁 {currentPage + 1} / {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages - 1}>
          下一頁
        </button>
      </div>
    </div>
  );
}

export default SearchPage;
