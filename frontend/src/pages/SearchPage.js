import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import '../styles/pages/SearchPage.module.css';
import { useLocation } from 'react-router-dom';

function SearchPage() {
  const [articles, setArticles] = useState([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query') || '';

  useEffect(() => {
    if (query) {
      axios
        .get('http://localhost:8080/blog/api/articles/search', {
          params: { query: query }
        })
        .then((response) => {
          console.log('Response:', response.data); // 確認響應數據
          setArticles(response.data); // 直接設置為響應的數據
        })
        .catch((error) => {
          console.error('搜尋文章失敗:', error);
        });
    }
  }, [query]);

  return (
    <div className="search-page">
      <SearchBar onSearch={(searchQuery) => {
        window.location.href = `/searchPage?query=${encodeURIComponent(searchQuery)}`;
      }} />
      <div>
        {articles.length > 0 ? (
          articles.map((article) => (
            <div key={article.articleId} className="article-card">
              <h3>{article.title}</h3>
              <p>{article.contentTEXT}</p>
              <p className="author-name">作者: {article.authorId || '未知'}</p>
            </div>
          ))
        ) : (
          <p>找不到文章</p>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
