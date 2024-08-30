import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar'
import axios from 'axios';

function ArticlesPage() {
  const [articles, setArticles] = useState([]);

  const handleSearch = (query) => {
    axios
      .get(`http://localhost:8080/blog/api/articles`, {
        params: { query: query },
      })
      .then((response) => {
        setArticles(response.data);
      })
      .catch((error) => {
        console.error('搜尋文章失敗:', error);
      });
  };

  useEffect(() => {
    handleSearch(''); // 預設載入所有文章
  }, []);

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
