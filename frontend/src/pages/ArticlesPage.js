import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/ArticlesPage.css';

const ArticlesPage = () => {
  const [articleVo, setArticleVo] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetch(`http://niceblog.myvnc.com:8080/api/articles?page=${currentPage}&size=10`)
      .then(response => response.json())
      .then(data => {
        setArticleVo(data.content);
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
          {articleVo && articleVo.length > 0 ? (
            articleVo.map(article => (
              <article className="post" key={article.articleId}>
                <Link to={`/edit-article/${article.articleId}`}>
                  <div>
                    {article.title} | 作者 : {article.authorId} | 更新於 : {new Date(article.lastEditedAt).toLocaleDateString()}
                  </div>
                </Link>
              </article>
            ))
          ) : (
            <p>正在加載文章...</p> // 可以根據需求顯示加載狀態或提示語
          )}
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
