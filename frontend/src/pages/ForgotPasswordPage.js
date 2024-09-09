import React, { useState } from 'react';
import '../styles/pages/ForgotPasswordPage.css'; // 引用样式文件

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: 添加密码重置逻辑

    try {
      const response = await fetch('http://localhost:8080/blog/ac/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      if (response.ok) {
        const data = await response.text();
        console.log(data)
        setErrorMessage('');
        setSuccessMessage('密碼重置信件已寄送至您的信箱，請於1小時內使用連結(信件寄送會有約2分鐘延遲...)。');
      } else {
        const error = await response.text();
        console.log(error)
        setSuccessMessage('');
        setErrorMessage(error || '密碼重置申請失敗，請稍後再試。');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('伺服器發生錯誤，請稍後重試。');
    }
    
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-form">
        <h2>忘記密碼</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">電子郵件</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit">發送重置信件</button>
          <div className="message-container">
            {errorMessage && (
              <p className="error-message shake" style={{ whiteSpace: 'pre-line' }}>
                {errorMessage}
              </p>
            )}
            {successMessage && (
              <div className="succ-message">
                <p>{successMessage}</p>
              </div>
            )}
            </div>
            <div className="login-footer">
                <a href="/login" className="forgot-password">返回登入</a>
            </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
