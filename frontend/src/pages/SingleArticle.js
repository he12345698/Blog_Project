import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/pages/SingleArticle.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { UserContext } from '../components/UserContext';

const SingleArticle = () => {
    const { articleId } = useParams(); // 從 URL 中獲取 articleId
    const [article, setArticle] = useState(null);
    const [comments, setComments] = useState([]);
    const [likeCount, setLikeCount] = useState(0);
    const [hasLiked, setHasLiked] = useState(false); // 追蹤是否已按讚
    const [newComment, setNewComment] = useState(''); // 新增留言的 state
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/blog/api/articles/${articleId}`);
                setArticle(response.data);
                setLikeCount(response.data.likes);

                // 使用 token 檢查當前使用者是否按讚
                const token = localStorage.getItem('token');
                if (token) {
                    const likeResponse = await axios.get(`http://localhost:8080/blog/api/articles/${articleId}/isLiked`, {
                        headers: {
                            'Authorization': 'Bearer ' + token
                        }
                    });
                    setHasLiked(likeResponse.data.liked);
                }
            } catch (error) {
                console.error("獲取文章失敗", error);
            }
        };

        const fetchComments = async () => {
            try {
                // const response = await axios.get(`http://niceblog.myvnc.com:8080/blog/api/comments/article/${articleId}`);
                const response = await axios.get(`http://localhost:8080/blog/api/comments/article/${articleId}`);
                const fetchedComments = response.data;

                console.log('fetchedComments is ', fetchedComments)

                // 使用 token 檢查當前使用者對每條留言是否按讚
                const token = localStorage.getItem('token');

                if (token) {
                    const updatedComments = await Promise.all(fetchedComments.map(async (comment) => {
                        const likeResponse = await axios.get(`http://localhost:8080/blog/api/comments/${comment.id}/isLiked`, {
                            headers: {
                                'Authorization': 'Bearer ' + token
                            }
                        });
                        return {
                            ...comment,
                            hasLiked: likeResponse.data.liked
                        };
                    }));
                    setComments(updatedComments);
                } else {
                    // 如果沒有 token，默認每個留言的 hasLiked 為 false
                    setComments(fetchedComments.map(comment => ({
                        ...comment,
                        hasLiked: false
                    })));
                }
            } catch (error) {
                console.error("獲取留言失敗", error);
            }
        };
        fetchArticle();
        fetchComments();
    }, [articleId]);

    const toggleLike = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error("未登入或 token 不存在");
            }

            const response = await axios.post(`http://localhost:8080/blog/api/articles/${articleId}/like`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('token at singarticle is ', token)
            if (response.status === 200) {
                setHasLiked(!hasLiked);
                setLikeCount(prevCount => hasLiked ? prevCount - 1 : prevCount + 1);
            } else {
                console.error(`請求失敗，狀態碼: ${response.status}`);
            }
        } catch (error) {
            console.error("按讚失敗：", error.message || error);
        }
    };

    const toggleCommentLike = async (commentId) => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                console.error("使用者未登入或 token 不存在");
                return;
            }

            const response = await axios.post(`http://localhost:8080/blog/api/comments/${commentId}/like`, {}, {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });

            if (response.status === 200) {
                setComments(comments.map(comment =>
                    comment.id === commentId ? {
                        ...comment,
                        likes: comment.hasLiked ? comment.likes - 1 : comment.likes + 1,
                        hasLiked: !comment.hasLiked
                    } : comment
                ));
            } else {
                console.error(`請求失敗，狀態碼: ${response.status}`);
            }
        } catch (error) {
            console.error("按讚失敗", error);
        }
    };

    const handleNewCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                console.error("使用者未登入或 token 不存在");
                return;
            }

            const commentData = {
                content: newComment,
                author: 'YourAuthorName', // 這裡你可以替換為實際的作者名
            };

            const response = await axios.post(`http://localhost:8080/blog/api/comments?articleId=${articleId}`, commentData, {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });

            setComments([...comments, { ...response.data, hasLiked: false }]);
            setNewComment('');
        } catch (error) {
            console.error("提交留言失敗", error);
        }
    };

    if (!article) return <p>加載中...</p>;

    return (
        <main className="content">
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
                    <button type="button" className="like-btn" onClick={toggleLike}>
                        {hasLiked ? '收回讚' : '按讚'} (<span className="like-count">{likeCount}</span>)
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
                                <p className="comment-date">{new Date(comment.createdAt).toLocaleString()}</p>
                            </div>
                            <p className="comment-text">{comment.content}</p>
                            <div className="like-comment-button">
                                <button type="button" className="like-comment-btn" onClick={() => toggleCommentLike(comment.id)}>
                                    {comment.hasLiked ? '收回讚' : '按讚'} (<span className="comment-like-count">{comment.likes}</span>)
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
        </main>
    );
};

export default SingleArticle;
