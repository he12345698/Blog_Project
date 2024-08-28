import React, { useState, useEffect } from 'react';
import styles from "../styles/components/UserArticles.module.css";

//用來顯示用戶發表的文章列表

const UserArticles = () => {

    // 管理文章資料
    const [ articles, setAtrticles ] = useState([]);

    // 獲取文章資料
    useEffect(() => {
        fetch('')
        .then(response => response.json)
        .then(data => {
            setAtrticles(data);
        })
        .catch(error => {
            console.log("獲取文章失敗", error);
        })
    });

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
                        <p className={`lh-base ${styles.content}`}>{article.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};


export default UserArticles;