import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/pages/OneArticlePage.css';

function OneArticlePage() {
    // 從 URL 參數中獲取文章 ID
    const { articleId } = useParams();

    // 定義狀態變數
    const [article, setArticle] = useState(null); // 存儲文章數據
    const [comments, setComments] = useState([]); // 存儲評論數據
    const [editCommentId, setEditCommentId] = useState(null); // 存儲正在編輯的評論 ID
    const [editContent, setEditContent] = useState(''); // 存儲編輯中的評論內容

    // 使用 useEffect 來在組件渲染後加載文章和評論
    useEffect(() => {
        const fetchArticle = async () => {
            try {
                // 發送 GET 請求以獲取文章和評論數據
                const response = await axios.get(`http://localhost:8080/blog/api/articles/${articleId}`);
                console.log(response.data); // 打印響應數據以檢查結構
                setArticle(response.data.article); // 更新文章狀態
                // setComments(response.data.comments); // 更新評論狀態
            } catch (error) {
                // 捕獲並打印錯誤信息
                console.error("Error fetching article:", error.message);
            }
        };

        fetchArticle(); // 調用函數來加載數據
    }, [articleId]); // 依賴項為 articleId，當其改變時重新加載數據

    // 編輯評論處理函數
    const handleEditComment = (comment) => {
        setEditCommentId(comment.comment_id); // 設置正在編輯的評論 ID
        setEditContent(comment.content); // 設置編輯中的評論內容
    };

    // 保存編輯後的評論
    const handleSaveEdit = async (commentId) => {
        try {
            // 發送 PUT 請求以更新評論
            await axios.put(`/api/comments/${commentId}`, { content: editContent });
            // 更新狀態中的評論列表
            const updatedComments = comments.map(comment =>
                comment.comment_id === commentId ? { ...comment, content: editContent } : comment
            );
            setComments(updatedComments);
            setEditCommentId(null); // 清除編輯中的評論 ID
            setEditContent(''); // 清除編輯內容
        } catch (error) {
            // 捕獲並打印錯誤信息
            console.error("Error updating comment:", error);
        }
    };

    // 刪除評論處理函數
    const handleDeleteComment = async (commentId) => {
        try {
            // 發送 DELETE 請求以刪除評論
            await axios.delete(`/api/comments/${commentId}`);
            // 更新狀態中的評論列表
            setComments(comments.filter(comment => comment.comment_id !== commentId));
        } catch (error) {
            // 捕獲並打印錯誤信息
            console.error("Error deleting comment:", error);
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-9">
                    <div className="article-content">
                        {article ? (
                            <>
                                <h1 className="article-title">{article.title}</h1>
                                <p className="article-text">{article.content}</p>
                                <div className="like-section text-center">
                                    <button className="btn btn-outline-danger">
                                        <i className="fas fa-heart"></i> 喜歡 ({article.likes})
                                    </button>
                                </div>
                                <div className="article-meta">
                                    <div>作者: {article.username}</div>
                                    <div>發布時間: {article.published_at}</div>
                                </div>
                                <div className="return-to-list text-end">
                                    <button className="btn btn-secondary">返回文章列表</button>
                                </div>
                            </>
                        ) : (
                            <p>Loading article...</p>
                        )}
                    </div>

                    <div className="comments-section mt-4">
                        <h3>留言</h3>
                        {comments.length > 0 ? (
                            comments.map(comment => (
                                <div key={comment.comment_id} className="comment">
                                    <div className="d-flex align-items-center">
                                        <img src={comment.avatar_url} alt="留言者頭像" width="40" height="40" className="comment-avatar" />
                                        <div>
                                            <div className="comment-author">{comment.username}</div>
                                            <div className="comment-meta">留言時間: {comment.commented_at}</div>
                                        </div>
                                    </div>
                                    {editCommentId === comment.comment_id ? (
                                        <div>
                                            <textarea
                                                className="form-control"
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                            />
                                            <button
                                                className="btn btn-success mt-2"
                                                onClick={() => handleSaveEdit(comment.comment_id)}
                                            >
                                                保存
                                            </button>
                                            <button
                                                className="btn btn-secondary mt-2"
                                                onClick={() => setEditCommentId(null)}
                                            >
                                                取消
                                            </button>
                                        </div>
                                    ) : (
                                        <p>{comment.content}</p>
                                    )}
                                    <div className="comment-actions text-end">
                                        <button
                                            className="btn btn-outline-primary"
                                            onClick={() => handleEditComment(comment)}
                                        >
                                            編輯
                                        </button>
                                        <button
                                            className="btn btn-outline-danger ms-2"
                                            onClick={() => handleDeleteComment(comment.comment_id)}
                                        >
                                            刪除
                                        </button>
                                        <button className="btn btn-outline-danger ms-2">
                                            <i className="fas fa-heart"></i> 喜歡
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No comments yet</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OneArticlePage;
