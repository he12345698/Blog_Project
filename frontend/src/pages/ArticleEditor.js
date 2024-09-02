import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import articleService from '../services/ArticleService'; // 假設你有一個文章服務
import tagService from '../services/TagService'
import '../styles/pages/ArticleEditor.css';
const ArticleEditor = () => {
    const [title, setTitle] = useState('');
    const [contentTEXT, setContentTEXT] = useState('');
    const [tag, settag] = useState('');
    const [alltags, setalltags] = useState([]);
    const navigate = useNavigate();//用於跳轉網址
    const { articleId } = useParams();// 假設用於編輯現有文章
    const [likes, setlikes] = useState(0);

    // 加載文章內容（如果是編輯模式）
    useEffect(() => {
        tagService.getAllTags().then(alltags => {
            setalltags(alltags);
            console.log("getAllTags");
            console.log(alltags);
        })
        if (articleId) {
            articleService.getArticleById(articleId).then(article => {
                setTitle(article.title);
                setContentTEXT(article.contentTEXT);
                setlikes(article.likes);
            });
            tagService.getArticleTag(articleId).then(tag => {
                settag(tag);
                console.log(tag);
            });
        }
    }, [articleId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const articleData = { title, contentTEXT, tag, likes };

        try {
            if (articleId) {
                // 更新文章 傳入id和內容
                console.log("updating... id=" + articleId);
                await articleService.updateArticle(articleId, articleData);
            } else {
                // 創建新文章 只傳入內容 id自動生成
                console.log("creating...")
                await articleService.createArticle(articleData);
            }
            alert("文章提交成功! 將返回文章列表");
            navigate('/articlesPage'); // 成功後跳轉
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
                                value={tag}  // 確保這裡的 tag 是正確的 tag_id
                                onChange={(e) => settag(e.target.value)}
                                required
                            >
                                <option value="">請選擇分類</option>
                                {alltags.map((tag) => (
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
