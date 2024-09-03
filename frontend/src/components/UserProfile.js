import React, { useState, useEffect } from 'react';
import styles from "../styles/components/UserProfile.module.css"
import { useNavigate } from 'react-router-dom';

// 用來顯示和編輯用戶的基本資料（用戶名、電子郵件、密碼）

const UserProfile = ({ userId }) => {

    // 管理不同型態(編輯中 or 顯示中)的編輯狀態
    const [editing, setEditing] = useState({
        username: false,
        email: false,
    });

    // 用來管理用戶資料
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        createdDate: '',
        lastLoginDate: '',
    });

    // 防止用戶在請求未完成時重複提交
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    let navigate = useNavigate();

    // 獲取後端資料
    useEffect(() => {
        setLoading(true);

        // fetch(`http://niceblog.myvnc.com:8080/blog/api/userProfile/${userId}`)
        fetch(`http://localhost:8080/blog/api/userProfile/${userId}`)
            .then(response => {
                console.log('網頁回應:', response);
                return response.json();
            })
            .then(data => {
                console.log("得到的數據", data)
                setUserData(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("獲取用戶資料失敗", error);
                setError("獲取用戶資料失敗");
                setLoading(false);
            })
    }, [userId]);

    // 輸入變化
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevData => ({
            ...prevData, [name]: value
        }));
    }

    // 切換編輯狀態
    const toggleEdit = (field) => {
        setEditing(prev => ({
            ...prev, [field]: !prev[field]// 取prev狀態的相反
        }));
    }

    // 處裡保存
    const handleSave = (field) => {
        setLoading(true);

        // fetch(`http://niceblog.myvnc.com:8080/blog/api/userProfile/update-${field}/${userId}`, {
            fetch(`http://localhost:8080/blog/api/userProfile/update-${field}/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                { [field]: userData[field] }
            ),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("保存數據失敗");
                }
                setLoading(false);
                toggleEdit(field);// 保存成功後切回顯示模式
            })
            .catch(error => {
                setLoading(false);
                console.log("保存數據失敗", error);
                setError("保存數據失敗");
            })
    }

    const handleClick = () => {
        navigate('/ChangePassword'); // 跳轉到修改密碼頁面
    }

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
                        value={userData.username}
                        onChange={handleInputChange}
                        disabled={!editing.username} //根據編輯狀態關閉或開啟
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
                        value={userData.email}
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