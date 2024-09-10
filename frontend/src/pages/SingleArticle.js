import React, { useState, useEffect, useContext } from "react";
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
    const { user } = useContext(UserContext); // 取得 setUser 方法
    const id = user?.id;
    const [author, setAuthor] = useState(null); // 儲存作者資訊
    const [editingComment, setEditingComment] = useState(null);  // 用於儲存正在編輯的留言
    const [editedCommentText, setEditedCommentText] = useState('');  // 編輯後的留言內容


    const handleBack = () => {
        window.history.back(); // 返回到上一个页面
    };

    useEffect(() => {

        const fetchArticle = async () => {

            try {
                const response = await axios.get(`http://localhost:8080/blog/api/articles/${articleId}`);
                setArticle(response.data);
                setLikeCount(response.data.likes);

                // 獲取作者詳細資料
                const authorResponse = await axios.get(`http://localhost:8080/blog/api/articles/authors/${response.data.authorId}`);
                setAuthor(authorResponse.data);

                const token = localStorage.getItem('token');
                if (token) {
                    const likeResponse = await axios.get(`http://localhost:8080/blog/api/articles/${articleId}/isLiked`, {
                        headers: {
                            'Authorization': 'Bearer ' + token
                        }
                    });
                    setHasLiked(likeResponse.data.liked);
                    console.log("Author Name:", response.data.authorName);
                }
            } catch (error) {
                console.error("獲取文章或作者資料失敗", error);
            }

        };

        const fetchComments = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/blog/api/comments/article/${articleId}`);
                const fetchedComments = response.data;

                console.log('fetchedComments is ', fetchedComments)
                console.log('fetchedComments.0 is ', fetchedComments[0].author.imagelink)
                console.log('comments imagelink is ', fetchedComments[0].author.imagelink)
                console.log('fetchedComments whit id is ', fetchedComments[fetchedComments.id])

                // 使用 token 檢查當前使用者對每條留言是否按讚
                const token = localStorage.getItem('token');
                if (token) {
                    const updatedComments = await Promise.all(fetchedComments.map(async (comment) => {
                        const likeResponse = await axios.get(`http://localhost:8080/blog/api/comments/${comment.id}/isLiked`, {
                            headers: {
                                'Authorization': 'Bearer ' + token
                            }
                        });
                        console.log('likeResponse.data.liked is ', likeResponse.data.liked)
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
                console.error("獲取留言失敗", error.response ? error.response.data : error.message);  // 詳細錯誤日誌
            }
        };
        console.log('comments.hasLiked is ', comments.hasLiked)
        console.log('comments is ', comments)

        fetchArticle();
        fetchComments();
    }, [id, articleId]);  // 確保 articleId 變化時重新加載

    const toggleLike = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error("未登入或 token 不存在");
            }

            const response = await axios.post(`http://localhost:8080/blog/api/articles/${articleId}/like`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log('token at singarticle is ', token)
            if (response.status === 200) {
                setHasLiked(!hasLiked);
                setLikeCount(prevCount => hasLiked ? prevCount - 1 : prevCount + 1);
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
                headers: { 'Authorization': 'Bearer ' + token }
            });

            if (response.status === 200) {
                setComments(comments.map(comment =>
                    comment.id === commentId ? {
                        ...comment,
                        likes: comment.hasLiked ? comment.likes - 1 : comment.likes + 1,
                        hasLiked: !comment.hasLiked
                    } : comment
                ));
            }
        } catch (error) {
            console.error("按讚失敗", error);
        }
    };

    const handleNewCommentChange = (e) => setNewComment(e.target.value);

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const commentData = {
                content: newComment,
                authorId: user.id  // 傳遞當前用戶的 ID 作為作者
            };

            console.log("Comment data being sent: ", commentData);  // 調試：檢查數據

            // 調試：確認 articleId 是否正確
            console.log("Article ID being used for comment submission: ", articleId);

            const response = await axios.post(`http://localhost:8080/blog/api/comments?articleId=${articleId}`, commentData, {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            setComments([...comments, { ...response.data, hasLiked: false }]);
            setNewComment('');
        } catch (error) {
            console.error("提交留言失敗", error.response ? error.response.data : error.message);  // 調試：打印具體錯誤信息
        }
    };

    const handleEditComment = (comment) => {
        setEditingComment(comment.id);  // 設定要編輯的留言
        setEditedCommentText(comment.content);  // 初始化編輯框內容為當前留言的內容
    };

    const handleSaveEditedComment = async (commentId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const updatedComment = { content: editedCommentText };

            const response = await axios.put(`http://localhost:8080/blog/api/comments/${commentId}`, updatedComment, {
                headers: { 'Authorization': 'Bearer ' + token }
            });

            if (response.status === 200) {
                // 更新留言列表，替換掉編輯過的留言
                setComments(comments.map(comment =>
                    comment.id === commentId ? { ...comment, content: editedCommentText } : comment
                ));
                setEditingComment(null);  // 退出編輯模式
            }
        } catch (error) {
            console.error("更新留言失敗", error);
        }
    };


    if (!article || !author) return <p>加載中...</p>;

    return (
        <main className="content">
            <section className="single-article">
                <div className="article-header">
                    <div className="article-author">
                        <img src={author.imagelink} width="60" height="60" alt="作者頭像" />

                        <div className="article-meta">
                            <p className="author">作者 : {article?.authorName}</p>
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
                <button className="back-to-list-btn" onClick={handleBack}>
                    返回文章列表
                </button>
            </section>

            <section className="comments-section">
                <h3>留言區</h3>
                <div className="comment-container">
                    {comments.map(comment => (
                        <div className="comment" key={comment.id}>
                            <div className="comment-header">
                                <img src={comment.author.imagelink} width="40" height="40" alt="留言者頭像" className="commenter-avatar" />
                                <a className="commenter-name" href={`http://localhost:81/UserData/${comment.author.id}`}>{comment.author ? comment.author.username : '匿名'}</a>
                                <p className="comment-date">{new Date(comment.createdAt).toLocaleString()}</p>
                            </div>
                            {editingComment === comment.id ? (
                                <textarea
                                    value={editedCommentText}
                                    onChange={(e) => setEditedCommentText(e.target.value)}
                                />
                            ) : (
                                <p className="comment-text">{comment.content}</p>
                            )}
                            <div className="like-comment-button">
                                <button type="button" className="like-comment-btn" onClick={() => toggleCommentLike(comment.id)}>
                                    {comment.hasLiked ? '收回讚' : '按讚'} (<span className="comment-like-count">{comment.likes}</span>)
                                </button>
                                {Number.parseInt(comment.author.id) === Number.parseInt(user.id) && (

                                    <>
                                        {editingComment === comment.id ? (// 顯示「編輯」按鈕給留言作者
                                            <button type="button" className="save-edit-btn" onClick={() => handleSaveEditedComment(comment.id)}>
                                                保存
                                            </button>
                                        ) : (
                                            <button type="button" className="edit-comment-btn" onClick={() => handleEditComment(comment)}>
                                                編輯
                                            </button>
                                        )}
                                    </>
                                )}
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
