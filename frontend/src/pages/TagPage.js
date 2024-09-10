// src/pages/TagPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import styles from '../styles/pages/TagPage.module.css';

function TagPage() {
  const { tagId } = useParams();
  const [articles, setArticles] = useState([]);
  const [tags, setTags] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query') || ''; // 取得搜尋參數

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://localhost:8080/blog/articlesByTag', {
          params: { tagId, page: currentPage, size: 10 }
        });
        setArticles(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('獲取標籤文章失敗:', error);
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
  }, [tagId, currentPage]);

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

  const handleTagClick = (id) => {
    navigate(`/tag/${id}?query=${encodeURIComponent(query)}`); // 保留搜尋參數
  };

  const getTagNameById = (id) => {
    const tag = tags.find(tag => tag.tag_id === id);
    return tag ? tag.name : '未知標籤';
  };

  const handleSearch = (query) => {
    navigate(`/searchPage?query=${encodeURIComponent(query)}`);
  };

  return (
    <div className={styles.tag_page}>
      <SearchBar onSearch={handleSearch} value={query} /> {/* 傳遞搜尋參數 */}
      
      <div className={styles.tag_list}>
        {tags.map((tag) => (
          <button
            key={tag.tag_id}
            onClick={() => handleTagClick(tag.tag_id)}
            className={styles.tag_button}
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

export default TagPage;
