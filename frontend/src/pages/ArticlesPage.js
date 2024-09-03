import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import styles from '../styles/pages/ArticlesPage.module.css'; // 導入 CSS 模組

function ArticlesPage() {
  const [articles, setArticles] = useState([]); // 用來存放文章列表的狀態
  const [currentPage, setCurrentPage] = useState(0); // 當前頁碼
  const [totalPages, setTotalPages] = useState(0); // 總頁數
  const navigate = useNavigate();

  // 取得文章列表
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://localhost:8080/blog/api/articles', {
          params: { page: currentPage } // 請求當前頁面的數據
        });
        console.log('獲取的文章:', response.data); // 檢查返回的數據

        if (Array.isArray(response.data.content)) {
          setArticles(response.data.content); // 設定文章列表
          setTotalPages(response.data.totalPages); // 更新總頁數
        } else {
          console.error('API 回應不包含有效的文章數組');
        }
      } catch (error) {
        console.error('獲取文章失敗:', error);
      }
    };

    fetchArticles();
  }, [currentPage]); // 當 currentPage 改變時，重新獲取文章列表

  // 處理搜尋操作
  const handleSearch = (query) => {
    navigate(`/searchPage?query=${encodeURIComponent(query)}`); // 導航到搜尋結果頁面
  };

  // 切換到上一頁
  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1); // 更新為前一頁
    }
  };

  // 切換到下一頁
  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1); // 更新為下一頁
    }
  };

  return (
    <div className={styles.articles_page}>
      <SearchBar onSearch={handleSearch} />
      <div className={styles['article-list']}>
        {articles.length > 0 ? (
          articles.map((article) => (
            <div key={article.articleId} className={styles['article-card']}>
              <a>{article.title}</a>
              <a className={styles['author-name']}>作者: {article.authorId}</a>
              <a className={styles['author-lastEditedAt']}>更新時間: {article.lastEditedAt}</a>
            </div>
          ))
        ) : (
          <p>沒有找到文章</p> // 顯示沒有找到文章的訊息
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

export default ArticlesPage;
