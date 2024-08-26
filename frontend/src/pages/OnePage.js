import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const OnePage = () => {
    const { id } = useParams(); // 取得路由參數中的文章 ID
    const [article, setArticle] = useState(null); // 記錄文章資料的狀態
    const [comments, setComments] = useState([]); // 記錄評論資料的狀態
    const [loading, setLoading] = useState(true); // 記錄資料加載狀態的狀態

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 取得文章資料
                const articleResponse = await fetch(`http://localhost:8080/blog/api/articles/${id}`);
                if (!articleResponse.ok) {
                    throw new Error('Network response was not ok');
                }
                const articleData = await articleResponse.json();
                console.log('Article data:', articleData); // 輸出文章資料以便除錯
                setArticle(articleData);

                // 取得評論資料
                const commentsResponse = await fetch(`http://localhost:8080/blog/api/comments/${id}`);
                if (!commentsResponse.ok) {
                    throw new Error('Network response was not ok');
                }
                const commentsData = await commentsResponse.json();
                console.log('Comments data:', commentsData); // 輸出評論資料以便除錯
                setComments(commentsData);
            } catch (error) {
                console.error('Error fetching data:', error); // 捕捉並輸出錯誤
            } finally {
                setLoading(false); // 資料加載完成，設置加載狀態為 false
            }
        };

        fetchData(); // 呼叫 fetchData 函式來獲取資料
    }, [id]); // 當 id 參數改變時重新獲取資料

    if (loading) {
        return <p>Loading...</p>; // 當資料正在加載時顯示加載提示
    }

    return (
        <div>
            {article ? (
                <div>
                    <h1>{article.title}</h1> {/* 顯示文章標題 */}
                    <p>{article.content}</p> {/* 顯示文章內容 */}
                    <p>Author: {article.author}</p> {/* 顯示作者名稱 */}
                    <p>Tags: {Array.isArray(article.tags) ? article.tags.join(', ') : article.tags}</p> {/* 顯示文章標籤 */}
                    <p>Likes: {article.likesCount}</p> {/* 顯示喜歡數 */}
                </div>
            ) : (
                <p>No article found</p> // 當找不到文章時顯示提示
            )}
            <h2>Comments</h2>
            <ul>
                {comments.length > 0 ? (
                    comments.map(comment => (
                        <li key={comment.id}>
                            <p>{comment.content}</p> {/* 顯示評論內容 */}
                            <p>Author: {comment.author}</p> {/* 顯示評論作者 */}
                        </li>
                    ))
                ) : (
                    <p>No comments available</p> // 當沒有評論時顯示提示
                )}
            </ul>
        </div>
    );
};

export default OnePage;
