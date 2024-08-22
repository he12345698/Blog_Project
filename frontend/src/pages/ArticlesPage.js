import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/ArticlesPage.css';

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:8080/blog/api/articles?page=${currentPage}&size=10`)
      .then(response => response.json())
      .then(data => {
        setArticles(data.content);
        setTotalPages(data.totalPages);
      });
  }, [currentPage]);
  

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <main className="content">
      <section className="article-list">
        <div className="post-container">
          {articles.map(article => (
            <article className="post" key={article.id}>
              <Link to={`/single-article/${article.id}`}>
                {article.title} | 作者 : {article.author} | 更新於 : {new Date(article.updatedDate).toLocaleDateString()}
              </Link>
            </article>
          ))}
        </div>

        {/* 分頁導航 */}
        <nav className="pagination">
          <Link to="#" onClick={() => handlePageChange(0)} className={currentPage === 0 ? 'active' : ''}>首頁</Link>
          {Array.from({ length: totalPages }).map((_, index) => (
            <Link
              key={index}
              to="#"
              onClick={() => handlePageChange(index)}
              className={index === currentPage ? 'active' : ''}
            >
              {index + 1}
            </Link>
          ))}
          <Link to="#" onClick={() => handlePageChange(totalPages - 1)} className={currentPage === totalPages - 1 ? 'active' : ''}>尾頁</Link>
        </nav>

      </section>

      {/* 置頂按鈕 */}
      <button className="back-to-top">置頂</button>
    </main>
  );
};

export default ArticlesPage;
