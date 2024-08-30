import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import axios from 'axios';
import '../styles/pages/ArticlesPage.css';
import { useLocation, useNavigate } from 'react-router-dom';

function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  // 从 URL 查询参数中获取搜索查询
  const query = new URLSearchParams(location.search).get('query') || '';

  const handleSearch = (query) => {
    // 更新 URL 查询参数
    navigate(`?query=${encodeURIComponent(query)}`);
  };

  useEffect(() => {
    axios
      .get('http://localhost:8080/blog/api/articles', {
        params: { query: query },
      })
      .then((response) => {
        setArticles(response.data);
      })
      .catch((error) => {
        console.error('搜尋文章失敗:', error);
      });
  }, [query]); // 依赖于查询参数变化

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      {/* 在這裡渲染文章列表 */}
      <div>
        {articles.map((article) => (
          <div key={article.id}>
            <h3>{article.title}</h3>
            <p>{article.content}</p>
            <p>作者: {article.authorName}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ArticlesPage;
