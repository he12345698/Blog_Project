import React from 'react';
import styles from "../styles/components/UserArticles.module.css";

//用來顯示用戶發表的文章列表

const UserArticles = ({ articles }) => {
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