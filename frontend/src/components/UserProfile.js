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


    // 用來管理暫時的編輯資料
    const [tempUser, setTempUser] = useState('');

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

        setTempUser({
            username: user?.username || '',
            email: user?.email || '',
        });

        fetch(`http://localhost:8080/blog/api/userProfile/${userId}`)
            .then(response => response.json())
            .then(data => {
                setUserData(data);
                setLoading(false);
                setError('');
            })
            .catch(error => {
                console.error("獲取用戶資料失敗", error);
                setError("獲取用戶資料失敗");
                setLoading(false);
            });
    }, [userId, user?.username, user?.email]);

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

        // fetch(`http://niceblog.myvnc.com:8080/blog/api/userProfile/update-${field}/${userId}`, {
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
                    return response.text().then(text => {
                        throw new Error(text); 
                    });
                }
                return response.json(); // 確保正常響應的處理
            })
            .then(data => {
                // 更新 UserContext
                setUser(prevUser => ({ ...prevUser, [field]: tempUser[field] }));
                setLoading(false);
                toggleEdit(field); // 保存成功後切回顯示模式
                setError("");
            })
            .catch(error => {
                setLoading(false);
                console.error("保存數據失敗", error);
                setError(error.message || "保存數據失敗");
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
                <label htmlFor="username" className={`form-label fw-bold ${styles.label}`}>用戶名：</label>
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
                            className="btn btn-dark ms-2"
                            onClick={() => handleSave('username')}
                        >
                            儲存
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="btn btn-dark ms-2"
                            onClick={() => toggleEdit('username')}
                        >
                            編輯
                        </button>
                    )}
                </div>
            </div>

            <div className="col-12 mb-3">
                <label htmlFor="email" className={`form-label fw-bold ${styles.label}`}>電子郵件：</label>
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
                <label htmlFor="password" className={`form-label fw-bold ${styles.label}`}>密碼：</label>
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
                        className={`btn btn-dark p-1 fw-bold w-30 ${styles.profile_button}`}
                        onClick={handleClick}
                    >
                        更改密碼
                    </button>
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

export default UserProfile;
