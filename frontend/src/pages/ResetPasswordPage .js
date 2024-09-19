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
      const response = await axios.post('http://niceblog.myvnc.com:8080/blog/ac/reset-password',
        new URLSearchParams({
          token,
          newPassword
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      // 成功状态时，显示成功消息
      setErrorMessage('');
      setSuccessMessage(response.data);
    } catch (error) {
      // 如果后端返回的有响应数据（如错误消息），则使用 error.response.data 获取错误信息
      if (error.response && error.response.data) {
        setSuccessMessage('')
        setErrorMessage(error.response.data);
      } else {
        // 否则显示 Axios 捕获的错误信息
        setSuccessMessage('')
        setErrorMessage(error.message);
      }
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
