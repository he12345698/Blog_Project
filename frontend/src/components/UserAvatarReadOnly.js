import React, { useState, useEffect, useContext } from 'react';
import styles from "../styles/components/UserAvatar.module.css";
import Modal from 'react-modal';
import ImageUpload from "./ImageUpload";
import { UserContext } from './UserContext';

const UserAvatarReadOnly = ({ id }) => {

    // 用來管理用戶資料
    const [userData, setUserData] = useState({
        username: '',
        imagelink: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // 透過圖片路徑顯示圖片
    // 獲取後端資料
    useEffect(() => {
        setLoading(true);

        fetch(`http://localhost:8080/blog/api/userProfile/${id}`)
            .then(response => {
                // console.log('網頁回應:', response);
                return response.json();
            })
            .then(data => {
                // console.log("得到的數據", data)
                setUserData(data);
                console.log('userData.imagelink is ', data);
                setLoading(false);
            })
            .catch(error => {
                console.error("獲取用戶資料失敗", error);
                setError("獲取用戶資料失敗");
                setLoading(false);
            })
    }, [id]);

    return (
        <div className={`${styles.profile_picture_wrapper} text-center`}>
            {loading && <p className={styles.p}>載入中...</p>}
            {error && <p className={styles.p}>{error}</p>}
            <label className={`${styles.avatarName} form_label d_block`}>{userData.username}的頭像</label>
            <div className="image-container mb-3">
                <img
                    id={styles.profile_avatar}
                    src={userData.imagelink}
                    alt="頭像"
                    className="img-fluid rounded border border-3 border-dark"
                />
            </div>
        </div>
    );
};

export default UserAvatarReadOnly;