import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/LoginPage.css'

const ArticlesPage = () => {
  return (
    <main className="content">
      <section className="article-list">
        <div className="post-container">
          <article className="post">
            <Link to="/single-article">奧運射擊比賽亞軍是土耳其殺手?! | 作者 : abc | 更新於 : 2024/08/02</Link>
          </article>
          <article className="post">
            <Link to="/single-article">奧運射擊比賽亞軍是土耳其殺手?! | 作者 : abc | 更新於 : 2024/08/02</Link>
          </article>
          {/* 可以繼續添加更多文章 */}
        </div>

        {/* 分頁導航 */}
        <nav className="pagination">
          <Link to="#">首頁</Link>
          <Link to="#">1</Link>
          <Link to="#">2</Link>
          <Link to="#">3</Link>
          <Link to="#">4</Link>
          <Link to="#">5</Link>
          <Link to="#">尾頁</Link>
        </nav>
      </section>

      {/* 置頂按鈕 */}
      <button className="back-to-top">置頂</button>
    </main>
  );
};

export default ArticlesPage;
