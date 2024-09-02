import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/pages/ResetPasswordPage.module.css';

const ResetPasswordPage = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState('');

    useEffect(() => {
        // 提取 URL 中的 token 參數
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        setToken(token);
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (newPassword !== confirmPassword) {
            setErrorMessage('密碼不一致');
            return;
        }

        setIsLoading(true);
        setErrorMessage('');

        try {
            const response = await axios.post('http://localhost:8080/blog/ac/reset-password', new URLSearchParams({
                token,
                newPassword
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            setSuccessMessage(response.data);
        } catch (error) {
            setErrorMessage('Failed to reset password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.resetPasswordContainer}>
      <h2 className={styles.title}>重設密碼</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="newPassword">新密碼</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">確認密碼</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
        {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
        <button type="submit" className={styles["submitButton"]} disabled={isLoading}>
          {isLoading ? '重設中...' : '確認重設'}
        </button>
      </form>
    </div>
    );
};

export default ResetPasswordPage;
