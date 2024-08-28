import React, { useState } from 'react';
import styles from "../styles/components/UserAvatar.module.css";
import Modal from 'react-modal';
import ImageCropper from './ImageCropper';

const UserAvatar = ({ userId }) => {
    const [avatar, setAvatar] = useState({
        imagelink: '',
    });
    const [isModalOpen, setIsModalOpen] = useState(false);// 設定彈跳視窗開關
    const [imageSrc, setImageSrc] = useState(null);// 設定用來存放上傳照片的url
    const [croppedImage, setCroppedImage] = useState(null);

    // 處理文件變更事件
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setImageSrc(reader.result);
            reader.readAsDataURL(file);
        }
    };

    // 上傳圖片
    const handleUpload = () => {
        const formData = new FormData();
        formData.append('avatar', croppedImage);

        fetch('/api/upload-avatar', {
            method: 'POST',
            body: formData,
        }).then(response => {
            if (response.ok) {
                console.log('上傳成功');
                setIsModalOpen(false);
            }
        });
    };

    return (
        <div className={`${styles.profile_picture_wrapper} text-center`}>
            <label className={`${styles.avatarName} form_label d_block`}>我的頭像</label>
            <div className="image-container mb-3">
                <img
                    id={styles.profile_avatar}
                    src={avatar.imagelink || "IMG_20240701_124913.JPG"}
                    alt="Profile"
                    className="img-fluid rounded border border-3 border-dark"
                />
            </div>
            <button
                type="button"
                className={`btn btn-dark ${styles.photo}`}
                onClick={() => setIsModalOpen(true)}
            >
                更新頭像
            </button>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Crop Avatar"
            >
                <input type="file" accept="image/*" onChange={handleFileChange} />
                {imageSrc && (
                    <div>
                        <ImageCropper src={imageSrc} setCroppedImage={setCroppedImage} />
                    </div>
                )}
                <button type="button" onClick={handleUpload}>確定並上傳</button>
            </Modal>
        </div>
    );
};

export default UserAvatar;