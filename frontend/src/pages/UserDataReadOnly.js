import React, { useState, useEffect } from "react";
import UserProfileReadOnly from "../components/UserProfileReadOnly";
import UserAvatarReadOnly from "../components/UserAvatarReadOnly";
import UserArticlesReadOnly from "../components/UserArticlesReadOnly";
import { useParams } from 'react-router-dom';
import styles from "../styles/pages/UserData.module.css"
import { UserContext } from '../components/UserContext';


const UserDataReadOnly = () => {

    const { userId } = useParams(); // 從路由參數中獲取 userId
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 檢查userId是否為字串
    const isString = isNaN(userId);

    useEffect(() => {
        setLoading(true);
    
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/blog/api/userProfile/${userId}`);
                if (!response.ok) {
                    throw new Error('發生錯誤');
                }
                const data = await response.json();
                setUserData(data);
            } catch (error) {
                console.error("獲取用戶資料失敗", error);
                setError("獲取用戶資料失敗");
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, [userId]);

    return (
        <div className="container mt-2">
            <h1 className="text-center mb-4">{userData ? `${userData.username} 的小窩` : 'Loading...'}</h1>
            <div className="card mx-auto" style={{ maxWidth: '70%' }}>
                <div className="card-body p-1">
                    <main className="mt-4">
                        {userData ? (
                            <div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <UserProfileReadOnly userId={isString ? userData.id : userId} />
                                    </div>
                                    <div className="col-md-6 mb-3 d-flex justify-content-center align-items-center">
                                        <UserAvatarReadOnly id={isString ? userData.id : userId} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <UserArticlesReadOnly authorId={isString ? userData.id : userId} />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p>Loading...</p>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

export default UserDataReadOnly;