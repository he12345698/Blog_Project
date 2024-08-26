import React, { useState, useEffect } from 'react';
import styles from "../styles/components/UserAvatar.module.css";
import UploadAvatar from './UploadAvater';
//用來顯示和更新用戶頭像

const UserAvatar = ({ userId }) => {

    const [avatar, setAvatar] = useState({
        imagelink:'',
    });

    return (
        <div className={`${styles.profile_picture_wrapper} text-center`}>
            <label className={`${styles.avatarName} form_label d_block`}>我的頭像</label>
            <div className="image-container mb-3">
                <img
                    id={styles.profile_avatar}
                    src="IMG_20240701_124913.JPG"
                    alt="Profile"
                    className="img-fluid rounded border border-3  border-dark"
                />
            </div>
            <button type="button" className={`btn btn-dark ${styles.photo}`}>更新頭像</button>
            <UploadAvatar avatar={avatar} setAvatar={setAvatar} />
        </div>
    );
}

export default UserAvatar;