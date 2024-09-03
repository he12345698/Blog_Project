import React, { useState, useEffect } from "react";
import UserProfile from "../components/UserProfile";
import UserAvatar from "../components/UserAvatar";
import UserArticles from "../components/UserArticles";
import styles from "../styles/pages/UserData.module.css"


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
        <div className="container mt-2">
            <h1 className="text-center mb-4">Account Name 的小窩</h1>
            <div className="card mx-auto" style={{ maxWidth: '70%' }}>
                <div className="card-body p-1">
                    <main className="mt-4">
                        <div className="row">
                            {/* 左上角的 UserProfile 組件 */}
                            <div className="col-md-6 mb-3">
                                <UserProfile userId={userId} />
                            </div>
                            {/* 右上角的 UserAvatar 組件 */}
                            <div className="col-md-6 mb-3 d-flex justify-content-center align-items-center">
                                <UserAvatar id={userId} />
                            </div>
                        </div>
                        <div className="row">
                            {/* 下方的 UserArticles 組件 */}
                            <div className="col-12">
                                <UserArticles authorId={userId} />
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default UserData;