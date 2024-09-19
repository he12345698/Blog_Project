import React, { useState, useEffect } from 'react';
import styles from "../styles/components/UserArticles.module.css";
import articleService from '../services/ArticleService';
import { useNavigate } from 'react-router-dom';

// 用來顯示用戶發表的文章列表
const UserArticlesReadOnly = ({ authorId }) => {
    // 管理文章資料
    const [articles, setArticles] = useState([]);
    const [error, setError] = useState(null); // 用來顯示錯誤
    const [loading, setLoading] = useState(true); // 加入 loading 狀態
    const navigate = useNavigate();

    // 獲取文章資料
    useEffect(() => {
        console.log('authord id is ', authorId)
        const initialize = async () => {
            try {
                const userArticles = await articleService.getUserArticleByAuthorId(authorId);
                setArticles(userArticles);
                // console.log(articles);
            } catch (err) {
                setError("無法獲取文章資料，請稍後再試。");
            } finally {
                setLoading(false);
            }
        };

        if (authorId) {
            initialize();
        }
    }, [authorId]);

    if (loading) {
        return <div className="col-12"><p>載入中...</p></div>;
    }

    if (error) {
        return <div className="col-12"><p>{error}</p></div>;
    }

    if (articles.length === 0) {
        return <div className="col-12"><p>沒有發表過的文章。</p></div>;
    }

    return (
        <div className="col-12">
            <h2 className="mb-4 fw-bold">發表過的文章</h2>
            <ul className="list-group">
                {articles.map((article, index) => (
                    <li className="list-group-item mb-3 p-3 border rounded shadow-sm" key={index}>
                        <div className="d-flex flex-column">
                            <h4 className="mb-2">
                                <a href={`/singleArticle/${article.articleId}`} className={`text-decoration-none fw-bold ${styles.title}`}>
                                    {article.title}
                                </a>
                            </h4>
                            <p className={`lh-base text-muted mb-2 ${styles.truncate}`}>{article.contentTEXT}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserArticlesReadOnly;
