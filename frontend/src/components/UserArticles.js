import React, { useState, useEffect } from 'react';
import styles from "../styles/components/UserArticles.module.css";

// 用來顯示用戶發表的文章列表
const UserArticles = ({ authorId }) => {
    // 管理文章資料
    const [articles, setArticles] = useState([]);
    const [error, setError] = useState(null); // 用來顯示錯誤
    const [loading, setLoading] = useState(true); // 加入 loading 狀態

    // 獲取文章資料
    useEffect(() => {
        const apiUrl = `http://localhost:8080/blog/api/articles/author/${authorId}`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                setError('');
                return response.json();
            })
            .then(data => {
                console.log('獲取到的數據:', data); // 輸出數據以進行調試
                if (Array.isArray(data)) {
                    setArticles(data);
                } else {
                    setError('數據格式錯誤');
                }
            })
            .catch(error => {
                console.error("獲取文章失敗:", error.message);
                setError('無法連接到服務器');
            })
            .finally(() => setLoading(false)); // 無論成功與否，結束後都設置為不再 loading
    }, [authorId]); // 依賴於 id，當 id 改變時重新獲取資料

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
                                <a href={article.url} className="text-decoration-none text-dark fw-bold">
                                    {article.title}
                                </a>
                            </h4>
                            <p className={`lh-base text-muted mb-2 ${styles.truncate}`}>{article.contentTEXT}</p>
                            <div className="d-flex justify-content-end">
                                <button className="btn btn-dark btn-sm fw-bold">編輯</button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserArticles;
