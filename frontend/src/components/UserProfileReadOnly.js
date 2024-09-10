import React, { useState, useEffect, useContext } from 'react';
import styles from "../styles/components/UserProfile.module.css";

// 用來顯示和編輯用戶的基本資料（用戶名、電子郵件、密碼）
const UserProfileReadOnly = ({ userId }) => {

    // 用來管理用戶資料
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        createdDate: '',
        lastLoginDate: ''
    });

    // 變換時間格式
    const formattedDate1 = new Date(userData.createdDate).toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    const formattedDate2 = new Date(userData.lastLoginDate).toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    // 防止用戶在請求未完成時重複提交
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // 獲取後端資料
    useEffect(() => {

        setLoading(true);

        fetch(`http://localhost:8080/blog/api/userProfile/${userId}`)
            .then(response => response.json())
            .then(data => {
                setUserData(data);
                console.log(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("獲取用戶資料失敗", error);
                setError("獲取用戶資料失敗");
                setLoading(false);
            });
    }, [userId]);

    return (
        <div className="row">
            {loading && <p>載入中...</p>}
            {error && <p className="text-danger">{error}</p>}

            <div className="col-12 mb-1">
                <label htmlFor="username" className={`form-label fw-bold ${styles.label}`}>用戶名：</label>
                <div className="d-flex">
                    <p className={`fw-bold ${styles.time}`}>{userData.username}</p>
                </div>
            </div>

            <div className="col-12 mb-3">
                <label htmlFor="email" className={`form-label fw-bold ${styles.label}`}>電子郵件：</label>
                <div className="d-flex">
                    <p className={`fw-bold ${styles.time}`}>{userData.email}</p>
                </div>
            </div>

            <div className="col-12 mb-3">
                <label htmlFor="registrationDate" className={`form-label fw-bold ${styles.label}`}>用戶註冊日期：</label>
                <p className={`fw-bold ${styles.time}`}>{formattedDate1}</p>
            </div>

            <div className="col-12">
                <label htmlFor="lastLogin" className={`form-label fw-bold ${styles.label}`}>最後上線時間：</label>
                <p className={`fw-bold ${styles.time}`}>{formattedDate2}</p>
            </div>
        </div>
    );
}

export default UserProfileReadOnly;
