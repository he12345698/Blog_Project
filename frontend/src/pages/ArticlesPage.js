import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/ArticlesPage.module.css';
import SearchBar from '../components/SearchBar';

function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // 当前页码
  const [totalPages, setTotalPages] = useState(0); // 总页数
  const navigate = useNavigate();

  // 获取文章列表
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://localhost:8080/blog/api/articles', {
          params: { page: currentPage } // 请求当前页的数据
        });
        console.log('Fetched articles:', response.data); // 检查返回数据

        if (Array.isArray(response.data.content)) {
          setArticles(response.data.content);
          setTotalPages(response.data.totalPages); // 更新总页数
        } else {
          console.error('API response does not contain a valid articles array');
        }
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      }
    };

    fetchArticles();
  }, [currentPage]); // 依赖于当前页码

  // 处理搜索操作
  const handleSearch = (query) => {
    navigate(`/searchPage?query=${encodeURIComponent(query)}`);
  };

  // 切换到上一页
  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // 切换到下一页
  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="articles-page">
      <SearchBar onSearch={handleSearch} />
      <div className="article-list">
        {articles.length > 0 ? (
          articles.map((article) => (
            <div key={article.articleId} className="article-card">
              <h3>{article.title}</h3>
              <p>{article.contentTEXT}</p>
              <p className="author-name">作者: {article.authorId}</p>
            </div>
          ))
        ) : (
          <p>沒有找到文章</p>
        )}
      </div>
      <div className="pagination">
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

export default ArticlesPage;
