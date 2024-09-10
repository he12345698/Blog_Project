// src/pages/SearchPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import styles from '../styles/pages/SearchPage.module.css';

function SearchPage() {
  const [results, setResults] = useState([]);
  const [tags, setTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query') || '';

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/blog/search?keyword=${encodeURIComponent(query)}&page=${currentPage}&size=10`);
        setResults(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('獲取搜尋結果失敗:', error);
      }
    };

    const fetchTags = async () => {
      try {
        const response = await axios.get('http://localhost:8080/blog/api/tags/all');
        const sortedTags = response.data.sort((a, b) => a.tag_id - b.tag_id);
        setTags(sortedTags);
      } catch (error) {
        console.error('獲取標籤失敗:', error);
      }
    };

    fetchResults();
    fetchTags();
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

  const handleTagClick = (tagId) => {
    navigate(`/tag/${tagId}`);
  };

  const getTagNameById = (id) => {
    const tag = tags.find(tag => tag.tag_id === id);
    return tag ? tag.name : '未知標籤';
  };

  return (
    <div className={styles.search_page}>
      <SearchBar onSearch={handleSearch} value={query} /> {/* 傳遞 query 作為 value */}
      
      <div className={styles.tag_list}>
        {tags.map(tag => (
          <button
            key={tag.tag_id}
            className={styles.tag_button}
            onClick={() => handleTagClick(tag.tag_id)}
          >
            {tag.name}
          </button>
        ))}
      </div>

      <div className={styles['results-list']}>
        {results.length > 0 ? (
          results.map((result) => (
            <div key={result.article_id} className={styles['result-item']}>
              <div className={styles['result-content']}>
                <a href={`/singleArticle/${result.article_id}`} className={styles['result-title']}>{result.title}</a>
                <a href={`/UserData/${result.author_id}`} className={styles['result-author']}>| 作者: {result.username || '未知作者'}</a>
                <span className={styles['result-updated']}>| 更新時間: {result.last_edited_at}</span>
                <span className={styles['result-tag']}>| {getTagNameById(result.tag_id)}</span>
              </div>
              <div className={styles['result-excerpt']}>
                {result.contentTEXT}
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
        <span> {currentPage + 1} / {totalPages}頁 </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages - 1}>
          下一頁
        </button>
      </div>
    </div>
  );
}

export default SearchPage;
