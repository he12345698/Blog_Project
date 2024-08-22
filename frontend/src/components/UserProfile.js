import React from 'react';
import styles from "../styles/components/UserProfile.module.css"

// 用來顯示和編輯用戶的基本資料（用戶名、電子郵件、密碼）

const UserProfile = () => {

    return (
        <div className='row'>

            <label for="username">用戶名：</label><br />
            <input type="text" id="username" className={`form-control ${styles.text_area}`} name="username" value="accountName" />
            <button type='button' class={`btn btn-dark ${styles.profile_button}`}>編輯</button><br />

            <label for="email">電子郵件：</label><br />
            <input type="email" id="email" name="email" value="accountEmail" className={`form-control ${styles.text_area}`} />
            <button type='button' class={`btn btn-dark ${styles.profile_button}`}>編輯</button><br />

            <label for="password">密碼：</label><br />
            <input type="password" id="password" name="password" value="accountName" className={`form-control ${styles.text_area}`} />
            <button type='button' class={`btn btn-dark ${styles.profile_button}`}>編輯</button><br />

            <label for="registrationDate">用戶註冊日期：</label><br />
            <p>2021-01-28 01:11:10</p>

            <label for="lastLogin">最後上線時間：</label><br />
            <p>2024-08-21 22:17:48</p>
        </div>
    );
}

export default UserProfile;