import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import articleService from '../services/ArticleService';
import tagService from '../services/TagService';
import authService from '../services/AuthService';
import '../styles/pages/ArticleEditor.css';

const ArticleEditor = () => {
    const [title, setTitle] = useState('');
    const [contentTEXT, setContentTEXT] = useState('');
    const [tag, setTag] = useState('');
    const [allTags, setAllTags] = useState([]);
    const [userId, setUserId] = useState('');
    const navigate = useNavigate();
    const { articleId } = useParams();
    const [likes, setLikes] = useState(0);

    useEffect(() => {
        const initialize = async () => {
            try {
                const user = await authService.getUserInfo();
                setUserId(user.id);
                
                const tags = await tagService.getAllTags();
                setAllTags(tags);

                if (articleId) {
                    const article = await articleService.getArticleById(articleId);
                    setTitle(article.title);
                    setContentTEXT(article.contentTEXT);
                    setLikes(article.likes);

                    // 檢查是否當前用戶為文章作者
                    if (Number(article.authorId) !== Number(user.id)) {
                        // 處理無權編輯的邏輯
                        console.log(article.authorId);
                        console.log(user.id);
                        alert("你無權編輯此文章");
                        navigate('/articlesPage');
                    } else {
                        const articleTag = await tagService.getArticleTag(articleId);
                        setTag(articleTag);
                    }
                }
            } catch (error) {
                console.error('Error during initialization:', error);
                // navigate('/UserData');  // 如果無法獲取用戶信息，重定向到登錄頁面
            }
        };

        initialize();
    }, [articleId, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const articleData = { title, contentTEXT, tag, likes, authorId: userId };

        try {
            if (articleId) {
                await articleService.updateArticle(articleId, articleData);
            } else {
                await articleService.createArticle(articleData);
            }
            alert("文章提交成功! 將返回文章列表");
            navigate('/articlesPage');
        } catch (error) {
            alert("文章提交失敗! 請稍後再嘗試");
            console.error('文章提交失敗:', error);
        }
    };

    return (
        <div>
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
                            <label htmlFor="tag">分類：</label>
                            <select
                                id="tag"
                                name="tag"
                                value={tag}
                                onChange={(e) => setTag(e.target.value)}
                                required
                            >
                                <option value="">請選擇分類</option>
                                {allTags.map((tag) => (
                                    <option key={tag.tag_id} value={tag.tag_id}>
                                        {tag.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="contentTEXT">內文：</label>
                            <textarea
                                id="contentTEXT"
                                name="contentTEXT"
                                rows="10"
                                value={contentTEXT}
                                onChange={(e) => setContentTEXT(e.target.value)}
                                placeholder="請輸入文章內容"
                                required
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <button type="submit">發布</button>
                            <button type="button" onClick={() => navigate('/articlesPage')}>取消</button>
                        </div>
                    </form>
                </section>
            </main>
            <button className="back-to-top">置頂</button>
        </div>
    );
};

export default ArticleEditor;
