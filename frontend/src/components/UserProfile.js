import React, { useState, useEffect } from 'react';
import styles from "../styles/components/UserProfile.module.css"

// 用來顯示和編輯用戶的基本資料（用戶名、電子郵件、密碼）

const UserProfile = () => {

    // 管理不同型態(編輯中 or 顯示中)的編輯狀態
    const [editing, setEditing] = useState({
        username: false,
        email: false,
        password: false,
    });

    // 用來管理用戶資料
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: '',
        registrationDate: '',
        lastLogin: '',
    });

    // 防止用戶在請求未完成時重複提交
    const [loading, setLoading] = useState(false);

    // 獲取後端資料
    useEffect(() => {
        fetch('')
            .then(response => response.json)
            .then(data => {
                setUserData(data);
            })
            .catch(error => {
                console.error("獲取用戶資料失敗", error);
            })
    }, []);

    // 輸入變化
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData, [name]: value
        });
    }

    // 切換編輯狀態
    const toggleEdit = (field) => {
        setEditing({
            ...editing, [field]: !editing[field]// 取editing狀態的相反
        });
    }

    // 處裡保存
    const handleSave = (field) => {
        setLoading(true);

        fetch('', {
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
        })
    }

    return (
        <div class='row'>
            <label for="username">用戶名：</label><br />
            <div class={styles.inline}>
                {editing.username ? (
                    <input
                        type="text"
                        id="username"
                        class={`form-control ${styles.text_area}`}
                        name="username"
                        value={userData.username}
                        onChange={handleInputChange}
                        disabled={!editing.username} //根據編輯狀態關閉或開啟
                    />
                ) : (
                    <span className={styles.normal_text}>{userData.username}</span>
                )}
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

                <label for="email">電子郵件：</label><br />
                {editing.email ? (
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value="accountEmail"
                        class={`form-control ${styles.text_area}`}
                        onChange={handleInputChange}
                        disabled={!editing.email}
                    />
                ) : (
                    <span>{userData.email}</span>
                )}
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
                <label for="password">密碼：</label><br />
                {editing.password ? (
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value="123123123"
                        class={`form-control ${styles.text_area}`}
                        onChange={handleInputChange}
                        disabled={!editing.password}
                    />
                ) : (
                    <span>{userData.password}</span>
                )}
                {editing.password ? (
                    <button
                        type='button'
                        className={`btn btn-dark ${styles.profile_button}`}
                        onClick={() => handleSave('password')}
                    >
                        儲存
                    </button>
                ) : (
                    <button
                        type='button'
                        className={`btn btn-dark ${styles.profile_button}`}
                        onClick={() => toggleEdit('password')}
                    >
                        編輯
                    </button>
                )}
                <br />
            </div>

            <label for="registrationDate">用戶註冊日期：</label><br />
            <p>{userData.registrationDate}</p>

            <label for="lastLogin">最後上線時間：</label><br />
            <p>{userData.lastLogin}</p>
        </div>
    );
}

export default UserProfile;