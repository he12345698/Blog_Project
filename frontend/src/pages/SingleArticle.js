import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/pages/SingleArticle.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SingleArticle = () => {
    const { articleId } = useParams(); // 從 URL 中獲取 articleId
    const [article, setArticle] = useState(null);
    const [comments, setComments] = useState([]);
    const [likeCount, setLikeCount] = useState(0);
    const [newComment, setNewComment] = useState(''); // 新增留言的 state

    useEffect(() => {
        console.log(articleId);
        const fetchArticle = async () => {
            try {
                //const response = await axios.get(`http://niceblog.myvnc.com:8080/blog/api/articles/${articleId}`); // 使用動態獲取的 articleId
                const response = await axios.get(`http://localhost:8080/blog/api/articles/${articleId}`); // 使用動態獲取的 articleId
                console.log(response.data)
                setArticle(response.data);
                setLikeCount(response.data.likes);
            } catch (error) {
                console.error("獲取文章失敗", error);
            }
        };

        const fetchComments = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/blog/api/comments/article/${articleId}`);
                setComments(response.data);
            } catch (error) {
                console.error("獲取留言失敗", error);
            }
        };

        fetchArticle();
        fetchComments();
    }, [articleId]); // 當 articleId 改變時重新獲取數據

    const likeArticle = async () => {
        try {
            await axios.post(`http://localhost:8080/blog/api/articles/${articleId}/like`);
            setLikeCount(likeCount + 1);
        } catch (error) {
            console.error("按讚失敗", error);
        }
    };

    const likeComment = async (commentId) => {
        try {
            await axios.post(`http://localhost:8080/blog/api/comments/${commentId}/like`);
            setComments(comments.map(comment =>
                comment.id === commentId ? { ...comment, likes: comment.likes + 1 } : comment
            ));
        } catch (error) {
            console.error("按讚失敗", error);
        }
    };

    const handleNewCommentChange = (e) => {
        setNewComment(e.target.value); // 更新留言內容
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        try {
            // 構建提交數據
            const commentData = {
                content: newComment,
                author: 'YourAuthorName', // 這裡你可以替換為實際的作者名
            };
    
            // 发送POST请求，传递评论数据和文章ID
            const response = await axios.post(`http://localhost:8080/blog/api/comments?articleId=${articleId}`, commentData);
            
            // 更新评论列表，添加新评论
            setComments([...comments, response.data]); 
            setNewComment(''); // 清空输入框
        } catch (error) {
            console.error("提交留言失敗", error);
        }
    };
    

    if (!article) return <p>加載中...</p>;

    return (
        <main className="content">
            <Header />
            <section className="single-article">
                <div className="article-header">
                    <div className="article-author">
                        <img src="/Image/IMG_20240701_124913.JPG" width="50" height="50" alt="作者頭像" className="author-avatar" />
                        <div className="article-meta">
                            <p className="author">作者 : {article.authorId}</p>
                            <p className="date">更新於 : {new Date(article.updatedAt).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                <h2 className="article-title">{article.title}</h2>
                <div className="article-content">
                    <p className="content-text">{article.contentTEXT}</p>
                </div>
                <div className="like-button">
                    <button type="button" className="like-btn" onClick={likeArticle}>
                        按讚 (<span className="like-count">{likeCount}</span>)
                    </button>
                </div>
                <button className="back-to-list-btn" onClick={() => window.location.href = '/all-articles'}>
                    返回文章列表
                </button>
            </section>

            <section className="comments-section">
                <h3>留言區</h3>
                <div className="comment-container">
                    {comments.map(comment => (
                        <div className="comment" key={comment.id}>
                            <div className="comment-header">
                                <img src="/Image/IMG_20240701_124913.JPG" width="40" height="40" alt="留言者頭像" className="commenter-avatar" />
                                <p className="commenter-name">{comment.author}</p>
                                <p className="comment-date">{new Date(comment.createdAt).toLocaleString()}</p> {/* 使用 createdAt */}
                            </div>
                            <p className="comment-text">{comment.content}</p>
                            <div className="like-comment-button">
                                <button type="button" className="like-comment-btn" onClick={() => likeComment(comment.id)}>
                                    按讚 (<span className="comment-like-count">{comment.likes}</span>)
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="comment-form">
                    <h4>發表留言</h4>
                    <form onSubmit={handleSubmitComment}>
                        <div className="form-group">
                            <label htmlFor="comment-content">留言內容：</label>
                            <textarea
                                id="comment-content"
                                name="comment-content"
                                rows="4"
                                placeholder="請輸入留言內容"
                                value={newComment}
                                onChange={handleNewCommentChange}
                                required
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <button type="submit">提交留言</button>
                        </div>
                    </form>
                </div>
            </section>
            <Footer />
        </main>
    );
};

export default SingleArticle;
