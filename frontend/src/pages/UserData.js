import React, { useState, useEffect } from "react";
import UserProfile from "../components/UserProfile";
import UserAvatar from "../components/UserAvatar";
import UserArticles from "../components/UserArticles";
import styles from "../styles/pages/UserData.module.css"
import ImageUpload from "../components/ImageUpload";
import ImageCropper from "../components/ImageCropper";

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
                        console.log('id' + data.id);
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
        <div class={styles.wrapper}>
            <ImageUpload id={userId} />
            <h1>Account Name的小窩</h1>
            <main class={styles.profile_wrapper}>
                <div className={styles.profile_container}>
                    <div className={styles.grid_container}>
                        <div className={styles.profile}>
                            <UserProfile userId={userId} />
                        </div>
                        <div className={styles.avatar}>
                            <UserAvatar userId={userId} />
                        </div>
                        <div className={styles.full_width}>
                            {/* <UserArticles articles={articles} /> */}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default UserData;