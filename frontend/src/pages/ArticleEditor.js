import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import articleService from '../services/ArticleService'; // 假設你有一個文章服務
import '../styles/pages/ArticleEditor.css';

const ArticleEditor = () => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();//用於跳轉網址
    const { articleId } = useParams(); // 假設用於編輯現有文章

    // 加載文章內容（如果是編輯模式）
    React.useEffect(() => {
        if (articleId) {
            articleService.getArticleById(articleId).then(article => {
                setTitle(article.title);
                setCategory(article.category);
                setContent(article.content);
            });
        }
    }, [articleId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const articleData = { title, category, content };

        try {
            if (articleId) {
                // 更新文章 傳入id和內容
                await articleService.updateArticle(articleId, articleData);
            } else {
                // 創建新文章 只傳入內容 id自動生成
                await articleService.createArticle(articleData);
            }
            navigate('/all-articles'); // 成功後跳轉
        } catch (error) {
            console.error('文章提交失敗:', error);
        }
    };

    return (
        <div>
            <header className="top-bar">
                <div className="top-container">
                    <div className="logo">xxx部落格</div>
                    <nav className="navigation">
                        <a href="/all-articles">所有文章</a>
                        <a href="/edit-article">編輯文章</a>
                        <a href="#">發表文章</a>
                        <a href="#">關於我們</a>
                        <a href="#">帳戶管理</a>
                        <a href="/">首頁</a>
                    </nav>
                    <div className="user-login-container">
                        <div className="user-info">
                            <img src="/Image/IMG_20240701_124913.JPG" width="50" height="50" alt="使用者頭像" className="user-avatar" />
                            <span className="username">虎斑貓</span>
                        </div>
                        <div className="login-btn">
                            <button onClick={() => navigate('/login')}>登入</button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="edit-content">
                <section className="edit-form-container">
                    <h2>{articleId ? '編輯文章' : '創建文章'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="title">標題：</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="請輸入文章標題"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="category">分類：</label>
                            <select
                                id="category"
                                name="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                            >
                                <option value="">請選擇分類</option>
                                <option value="財金">財金</option>
                                <option value="政治">政治</option>
                                <option value="體育">體育</option>
                                <option value="國際">國際</option>
                                <option value="美食">美食</option>
                                <option value="遊戲">遊戲</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="content">內文：</label>
                            <textarea
                                id="content"
                                name="content"
                                rows="10"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="請輸入文章內容"
                                required
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <button type="submit">發布</button>
                            <button type="button" onClick={() => navigate('/all-articles')}>取消</button>
                        </div>
                    </form>
                </section>
            </main>

            <button className="back-to-top">置頂</button>

            <footer className="footer">
                <div className="footer-container">
                    <p>&copy; 2024 xxx部落格 版權所有.</p>
                </div>
            </footer>
        </div>
    );
};

export default ArticleEditor;
