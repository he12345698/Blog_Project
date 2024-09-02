import React, { useState, useEffect } from "react";
import UserProfile from "../components/UserProfile";
import UserAvatar from "../components/UserAvatar";
import UserArticles from "../components/UserArticles";
import styles from "../styles/pages/UserData.module.css"


const articles = [
    { title: '文章標題 1', url: 'article1-url', description: '文章摘要或簡短描述 1' },
    { title: '文章標題 2', url: 'article2-url', description: '文章摘要或簡短描述 2' },
    { title: '文章標題 3', url: 'article3-url', description: '文章摘要或簡短描述 3' },
];

const UserData = () => {

    // 用來管理用戶資料
    const [userId, setUserId] = useState('');

    // 透過圖片路徑顯示圖片
    // 獲取用戶信息
    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = localStorage.getItem('token');
            // console.log('Request Headers:', {
            //   'Authorization': `Bearer ${token}` 
            // });
            if (token) {
                try {
                    const response = await fetch('http://localhost:8080/blog/api/protected-endpoint', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        console.log('data:', data);
                        console.log('id:' + data.id);
                        console.log('userimage ' + data.userImage)
                        setUserId(data.id || null);
                    } else {
                        console.log('Response error:', response);
                        //setUsername('訪客2');
                        //setUserImage('/Image/default-avatar.jpg'); // 默认头像
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }

        };

        fetchUserInfo();
    }, []);

    return (
        <div className={styles.wrapper}>
            <h1 className={`text-center ${styles.custom_font}`}>Account Name 的小窩</h1>
            <main className="container mt-4">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <div className="card p-4 shadow-sm">
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <UserProfile userId={userId} />
                                </div>
                                <div className="col-md-6 mb-3 text-center d-flex justify-content-center align-items-center">
                                    <UserAvatar id={userId} />
                                </div>
                                <div className="col-12">
                                    {/* <UserArticles articles={articles} /> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default UserData;