import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import '../styles/pages/ArticlesPage.css';

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [query, setQuery] = useState(''); // 單一搜尋查詢

  // 處理搜尋功能
  const handleSearch = (searchQuery) => {
    setQuery(searchQuery); // 更新搜尋查詢
    setCurrentPage(0); // 搜尋時返回到首頁
    fetchArticles(searchQuery, 0);
  };

  // 獲取文章數據
  const fetchArticles = (query, page) => {
    // fetch(`http://192.168.50.38:8080/blog/api/articles/search?keyword=${encodeURIComponent(query)}&page=${page}&size=10`)
    fetch(`http://localhost:8080/blog/api/articles/search?keyword=${encodeURIComponent(query)}&page=${page}&size=10`)
      .then(response => response.json())
      .then(data => {
        setArticles(data.content || []);
        setTotalPages(data.totalPages || 0);
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  // 處理分頁更改
  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
      fetchArticles(query, page);
    }
  };

  useEffect(() => {
    // 當前頁碼或搜尋查詢變化時獲取資料
    fetchArticles(query, currentPage);
  }, [currentPage, query]); // 依賴於當前頁碼和搜尋查詢

  return (
    <main className="content">
      <SearchBar onSearch={handleSearch} />
      <section className="article-list">
        <div className="post-container">
          {articles.length > 0 ? (
            articles.map(article => (
              <article className="post" key={article.articleId}>
                <div>
                  {article.title} | 作者 : {article.authorId} | 更新於 : {new Date(article.lastEditedAt).toLocaleDateString()}
                </div>
              </article>
            ))
          ) : (
            <p>沒有文章。</p>
          )}
        </div>

        {/* 分頁導航 */}
        <nav className="pagination">
          <button
            onClick={() => handlePageChange(0)}
            disabled={currentPage === 0}
            className={currentPage === 0 ? 'active' : ''}
          >
            首頁
          </button>
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index)}
              className={index === currentPage ? 'active' : ''}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(totalPages - 1)}
            disabled={currentPage === totalPages - 1}
            className={currentPage === totalPages - 1 ? 'active' : ''}
          >
            尾頁
          </button>
        </nav>
      </section>

      {/* 置頂按鈕 */}
      <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        置頂
      </button>
    </main>
  );
};

export default ArticlesPage;
