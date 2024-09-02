import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import styles from '../styles/pages/SearchPage.module.css'; // 導入 CSS 模組

function SearchPage() {
  const [articles, setArticles] = useState([]); // 用來存放搜尋結果的文章列表
  const [query, setQuery] = useState(''); // 用來存放搜尋關鍵字
  const navigate = useNavigate();
  const location = useLocation();

  // 解析 URL 中的搜尋參數
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryParam = params.get('query');
    if (queryParam) {
      setQuery(queryParam); // 設定搜尋關鍵字
      fetchSearchResults(queryParam); // 使用關鍵字取得搜尋結果
    }
  }, [location.search]);

  // 使用 Axios 發送搜尋請求
  const fetchSearchResults = async (searchQuery) => {
    try {
      const response = await axios.get('http://localhost:8080/blog/api/articles/search', {
        params: { query: searchQuery } // 傳送搜尋關鍵字作為請求參數
      });
      console.log('搜尋結果:', response.data); // 檢查返回的搜尋結果
      setArticles(response.data); // 更新文章列表
    } catch (error) {
      console.error('搜尋失敗:', error); // 搜尋失敗時顯示錯誤訊息
    }
  };

  // 處理搜尋操作
  const handleSearch = (newQuery) => {
    navigate(`/searchPage?query=${encodeURIComponent(newQuery)}`); // 導航到新的搜尋結果頁面
  };

  return (
    <div className={styles.search_page}>
      <SearchBar onSearch={handleSearch} initialQuery={query} /> {/* 搜尋欄位 */}
      <div className={styles['article-list']}>
        {articles.length > 0 ? (
          articles.map((article) => (
            <div key={article.articleId} className={styles['article-card']}>
              <h3>{article.title}</h3>
              <p className={styles['author-name']}>作者: {article.authorId}</p>
            </div>
          ))
        ) : (
          <p>沒有找到相關文章</p> // 顯示沒有找到相關文章的訊息
        )}
      </div>
    </div>
  );
}

export default SearchPage;
