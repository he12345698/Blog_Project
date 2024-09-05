import React, { useState, useEffect, useContext } from 'react';
import styles from "../styles/components/UserProfile.module.css";
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';

// 用來顯示和編輯用戶的基本資料（用戶名、電子郵件、密碼）
const UserProfile = ({ userId }) => {
    const { user, setUser } = useContext(UserContext); // 取得 setUser 方法
    const [editing, setEditing] = useState({
        username: false,
        email: false,
    });

    // 用來管理用戶資料
    const [userData, setUserData] = useState({
        createdDate: '',
        lastLoginDate: ''
    });

    // 用來管理暫時的編輯資料
    const [tempUser, setTempUser] = useState({
        username: user?.username || '',
        email: user?.email || '',
    });

    // 防止用戶在請求未完成時重複提交
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    console.log('username is ', user?.username)

    // 獲取後端資料
    useEffect(() => {
        // 設置暫時用戶數據
        setTempUser({
            username: user?.username || '',
            email: user?.email || '',
        });

        setLoading(true);

        fetch(`http://localhost:8080/blog/api/userProfile/${userId}`)
            .then(response => response.json())
            .then(data => {
                setUserData(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("獲取用戶資料失敗", error);
                setError("獲取用戶資料失敗");
                setLoading(false);
            });
    }, [user, userId]); // 添加 userId 以便在 userId 改變時重新獲取資料

    // 輸入變化
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTempUser(prevTempUser => ({
            ...prevTempUser, [name]: value
        }));
    };

    // 切換編輯狀態
    const toggleEdit = (field) => {
        setEditing(prev => ({
            ...prev, [field]: !prev[field]
        }));
    };

    // 處裡保存
    const handleSave = (field) => {
        setLoading(true);

        fetch(`http://localhost:8080/blog/api/userProfile/update-${field}/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                { [field]: tempUser[field] }
            ),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("保存數據失敗");
                }
                // 更新 UserContext
                setUser(prevUser => ({ ...prevUser, [field]: tempUser[field] }));
                setLoading(false);
                toggleEdit(field); // 保存成功後切回顯示模式
            })
            .catch(error => {
                setLoading(false);
                console.error("保存數據失敗", error);
                setError("保存數據失敗");
            });
    };

    const handleClick = () => {
        navigate('/ChangePassword'); // 跳轉到修改密碼頁面
    };

    return (
        <div className="row">
            {loading && <p>載入中...</p>}
            {error && <p className="text-danger">{error}</p>}

            <div className="col-12 mb-1">
                <label htmlFor="username" className="form-label fw-bold">用戶名：</label>
                <div className="d-flex">
                    <input
                        type="text"
                        id="username"
                        className={`form-control ${styles.text_area}`}
                        name="username"
                        value={tempUser.username}
                        onChange={handleInputChange}
                        disabled={!editing.username} // 根據編輯狀態關閉或開啟
                    />
                    {editing.username ? (
                        <button
                            type="button"
                            className="btn btn-dark ms-2 fw-bold"
                            onClick={() => handleSave('username')}
                        >
                            儲存
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="btn btn-dark ms-2 fw-bold"
                            onClick={() => toggleEdit('username')}
                        >
                            編輯
                        </button>
                    )}
                </div>
            </div>

            <div className="col-12 mb-3">
                <label htmlFor="email" className="form-label fw-bold">電子郵件：</label>
                <div className="d-flex">
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={tempUser.email}
                        className={`form-control ${styles.text_area}`}
                        onChange={handleInputChange}
                        disabled={!editing.email}
                    />
                    {editing.email ? (
                        <button
                            type="button"
                            className="btn btn-dark ms-2 fw-bold"
                            onClick={() => handleSave('email')}
                        >
                            儲存
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="btn btn-dark fw-bold ms-2"
                            onClick={() => toggleEdit('email')}
                        >
                            編輯
                        </button>
                    )}
                </div>
            </div>

            <div className="col-12 mb-3">
                <label htmlFor="password" className="form-label fw-bold">密碼：</label>
                <div className="d-flex">
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value="*********"
                        className={`form-control ${styles.text_area} ${styles.input_password}`}
                        readOnly
                    />
                    <button
                        type="button"
                        className={`btn btn-dark p-1 fw-bold w-30`}
                        onClick={handleClick}
                    >
                        更改密碼
                    </button>
                </div>
            </div>

            <div className="col-12 mb-3">
                <label htmlFor="registrationDate" className="form-label fw-bold">用戶註冊日期：</label>
                <p className={styles.userProfie_p}>{userData.createdDate}</p>
            </div>

            <div className="col-12">
                <label htmlFor="lastLogin" className="form-label fw-bold">最後上線時間：</label>
                <p className='fw-bold'>{userData.lastLoginDate}</p>
            </div>
        </div>
    );
}

export default UserProfile;
