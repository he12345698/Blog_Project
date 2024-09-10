// src/pages/ArticlesPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import styles from '../styles/pages/ArticlesPage.module.css'; // 引入 CSS 模組



function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [tags, setTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://localhost:8080/blog/search?keyword', {
          params: { page: currentPage }
        });
        console.log('獲取的文章:', response.data);

        if (Array.isArray(response.data.content)) {
          setArticles(response.data.content);
          setTotalPages(response.data.totalPages);
        } else {
          console.error('API 回應不包含有效的文章數組');
        }
      } catch (error) {
        console.error('獲取文章失敗:', error);
      }
    };

    const fetchTags = async () => {
      try {
        const response = await axios.get('http://localhost:8080/blog/api/tags/all');
        const sortedTags = response.data.sort((a, b) => a.tag_id - b.tag_id);
        setTags(sortedTags);
      } catch (error) {
        console.error('獲取標籤失敗:', error);
      }
    };

    fetchArticles();
    fetchTags();
  }, [currentPage]);

  const handleSearch = (query) => {
    navigate(`/searchPage?query=${encodeURIComponent(query)}`);
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleTagClick = (tagId) => {
    navigate(`/tag/${tagId}`); // 導航到標籤頁面
  };

  const getTagNameById = (id) => {
    const tag = tags.find(tag => tag.tag_id === id);
    return tag ? tag.name : '未知標籤';
  };

  return (
    <div className={styles.articles_page}>
      <SearchBar onSearch={handleSearch} />
      
      <div className={styles['tag-list']}>
        {tags.map(tag => (
          <button
            key={tag.tag_id}
            className={styles['tag-item']}
            onClick={() => handleTagClick(tag.tag_id)}
          >
            {tag.name}
          </button>
        ))}
      </div>

      <div className={styles['article-list']}>
        {articles.length > 0 ? (
          articles.map((article) => (
            <div key={article.article_id} className={styles['article-card']}>
              <div className={styles['article-content']}>
                <a href={`/singleArticle/${article.article_id}`} className={styles['article-title']}>{article.title}</a>
                <a href={`/UserData/${article.author_id}`} className={styles['article-author']}>| 作者: {article.username || '未知作者'}</a>
                <span className={styles['article-updated']}>| 更新時間: {article.last_edited_at}</span>
                <span className={styles['article-tag']}>| {getTagNameById(article.tag_id)}</span>
              </div>
              <div className={styles['article-excerpt']}>
                {article.contentTEXT}
              </div>
            </div>
          ))
        ) : (
          <p>沒有找到文章</p>
        )}
      </div>

      <div className={styles.pagination}>
        <button onClick={handlePreviousPage} disabled={currentPage === 0}>
          上一頁
        </button>
        <span> {currentPage + 1} / {totalPages}頁 </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages - 1}>
          下一頁
        </button>
      </div>
    </div>
  );
}

export default ArticlesPage;
