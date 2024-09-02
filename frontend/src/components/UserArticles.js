import React, { useState, useEffect } from 'react';
import styles from "../styles/components/UserArticles.module.css";

// 用來顯示用戶發表的文章列表
const UserArticles = ({ id }) => {
    // 管理文章資料
    const [articles, setArticles] = useState([]);
    const [error, setError] = useState(null); // 用來顯示錯誤

    // 獲取文章資料
    useEffect(() => {
        const apiUrl = `http://localhost:8080/blog/api/articles/author/${id}`; // 請根據需要修改 URL

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                console.log('獲取到的數據:', data); // 輸出數據以進行調試
                if (Array.isArray(data)) {
                    setArticles(data);
                } else {
                    setError('數據格式錯誤');
                }
            })
            .catch(error => {
                console.log("獲取文章失敗", error);
                setError('獲取文章失敗');
            });
    }, [id]); // 依賴於 id，當 id 改變時重新獲取資料

    if (error) {
        return <div className="col-12"><p>{error}</p></div>;
    }

    return (
        <div className="col-12">
            <h2>發表過的文章</h2>
            <ul className="list-group">
                {articles.map((article, index) => (
                    <li className="list-group-item" key={index}>
                        <h3>
                            <a href={article.url} className={`text-decoration-none ${styles.title}`}>
                                {article.title}
                            </a>
                        </h3>
                        <p className={`lh-base ${styles.content}`}>{article.contentTEXT}</p>
                    </li>
                ))}
            </ul>
        </div>

    );
};

export default UserArticles;
