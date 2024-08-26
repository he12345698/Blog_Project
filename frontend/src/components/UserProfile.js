import React, { useState, useEffect } from 'react';
import styles from "../styles/components/UserProfile.module.css"

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

    // 獲取後端資料
    useEffect(() => {
        setLoading(true);

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
                setError("獲取用戶資料失敗")
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

    return (
        <div class='row'>
            {loading && <p>載入中...</p>}
            {error && <p className={styles.error}>{error}</p>}
            <label for="username" className={styles.userProfie_label}>用戶名：</label><br />

            <div class={styles.inline}>
                <input
                    type="text"
                    id="username"
                    class={`form-control ${styles.text_area}`}
                    name="username"
                    value={userData.username}
                    onChange={handleInputChange}
                    disabled={!editing.username} //根據編輯狀態關閉或開啟
                />
                {editing.username ? (
                    <button
                        type='button'
                        className={`btn btn-dark ${styles.profile_button}`}
                        onClick={() => handleSave('username')}
                    >
                        儲存
                    </button>
                ) : (
                    <button
                        type='button'
                        className={`btn btn-dark ${styles.profile_button}`}
                        onClick={() => toggleEdit('username')}
                    >
                        編輯
                    </button>
                )}
                <br />

                <label for="email" className={styles.userProfie_label}>電子郵件：</label><br />
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={userData.email}
                    class={`form-control ${styles.text_area}`}
                    onChange={handleInputChange}
                    disabled={!editing.email}
                />
                {editing.email ? (
                    <button
                        type='button'
                        className={`btn btn-dark ${styles.profile_button}`}
                        onClick={() => handleSave('email')}
                    >
                        儲存
                    </button>
                ) : (
                    <button
                        type='button'
                        className={`btn btn-dark ${styles.profile_button}`}
                        onClick={() => toggleEdit('email')}
                    >
                        編輯
                    </button>
                )}
                <br />
            </div>

            <div class={styles.inline}>
                <label for="password" className={styles.userProfie_label}>密碼：</label><br />
                <input
                    type="password"
                    id="password"
                    name="password"
                    value="*********"
                    class={`${styles.text_area} ${styles.input_password}`}
                    readOnly
                />
                    <button
                        type='button'
                        className={`btn btn-dark ${styles.profile_button}`}
                        onClick={() => toggleEdit('password')}
                    >
                        編輯
                    </button>
                <br />
            </div>

            <label for="registrationDate" className={styles.userProfie_label}>用戶註冊日期：</label><br />
            <p className={styles.userProfie_p}>{userData.createdDate}</p>

            <label for="lastLogin" className={styles.userProfie_label}>最後上線時間：</label><br />
            <p>{userData.lastLoginDate}</p>
        </div>
    );
}

export default UserProfile;