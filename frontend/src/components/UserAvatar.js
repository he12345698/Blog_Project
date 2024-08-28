import React, { useState, useEffect } from 'react';
import styles from "../styles/components/UserAvatar.module.css";
import Modal from 'react-modal';
import ImageCropper from './ImageCropper';

const UserAvatar = ({ userId }) => {
    // const [isModalOpen, setIsModalOpen] = useState(false);// 設定彈跳視窗開關

    // 用來管理用戶資料
    const [userImage, setUserImage] = useState('');

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
                        console.log('userimage ' + data.userImage)
                        setUserImage(data.userImage || 'public/UserImages/IMG_20240701_124913.JPG'); // 默认头像
                    } else {
                        console.log('Response error:', response);
                        //setUsername('訪客2');
                        //setUserImage('/Image/default-avatar.jpg'); // 默认头像
                    }
                } catch (error) {
                    console.error('Error:', error);
                    setUserImage('public/UserImages/IMG_20240701_124913.JPG'); // 默认头像
                }
            }

        };

        fetchUserInfo();
    }, []);


    return (
        <div className={`${styles.profile_picture_wrapper} text-center`}>
            <label className={`${styles.avatarName} form_label d_block`}>我的頭像</label>
            <div className="image-container mb-3">
                <img
                    id={styles.profile_avatar}
                    src={userImage}
                    alt="頭像"
                    className="img-fluid rounded border border-3 border-dark"
                />
            </div>
            <button
                type="button"
                className={`btn btn-dark ${styles.photo}`}
                // onClick={() => setIsModalOpen(true)}
            >
                更新頭像
            </button>

            {/* <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Crop Avatar"
            >

            </Modal> */}
        </div>
    );
};

export default UserAvatar;