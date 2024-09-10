import React, { useState, useEffect, useRef } from 'react';
import '../styles/pages/Register.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [animationKey, setAnimationKey] = useState(Date.now());
  const [countdown, setCountdown] = useState(3); // 倒數計時初始值（秒）

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordLength(newPassword);
    // 這裡不直接檢查相同性，因為可能還沒輸入確認密碼
  };

  const handleRePasswordChange = (e) => {
    const newRePassword = e.target.value;
    setRePassword(newRePassword);
    checkPasswordsMatch(password, newRePassword);
  };

  const checkPasswordLength = (password) => {
    setTimeout(() => {
      if (password.length < 8) {
        setErrorMessage('密碼至少需8位數');
      } else {
        // 如果長度檢查通過，可以清除錯誤訊息
        setErrorMessage((prev) => (prev === '密碼至少需8位數' ? '' : prev));
      }
    }, 750); // 設定 1 秒的延遲
  };

  const checkPasswordsMatch = (password, rePassword) => {
    setTimeout(() => {
      if (password !== rePassword) {
        setErrorMessage('密碼不相同');
      } else {
        setErrorMessage((prev) => (prev === '密碼不相同' ? '' : prev));
      }
    }, 750);
  };

const handleSubmit = async (event) => {
  event.preventDefault();
  setAnimationKey(Date.now());
  const missingFields = [];
  if (!username) missingFields.push('用戶名');
  if (!email) missingFields.push('電子郵件');
  if (!password) missingFields.push('密碼');
  if (!rePassword) missingFields.push('確認密碼');
  // 如果有任何字段沒填寫，顯示錯誤訊息
  if (missingFields.length > 0) {
    setErrorMessage(`請填寫：${missingFields.join('、')}`);
    return;
  }
  
  const userData = {
    username,
    email,
    password,
  };
  try {
    // const response = await fetch('http://niceblog.myvnc.com:8080/blog/ac/register', {
    const response = await fetch('http://localhost:8080/blog/ac/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (response.ok) {
      const message = await response.text(); 
      console.log(message);
      setSuccessMessage(message);
      setErrorMessage('');

      const timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(timer);
            window.location.href = `/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
          }
          return prevCountdown - 1;
        });
      }, 1000);

    } else {
      const errorMessage = await response.text();
      setSuccessMessage('');
      setErrorMessage(errorMessage || '註冊失敗，請重試。');
    }
  } catch (error) {
      console.error('Error:', error);
      setSuccessMessage('');
      setErrorMessage('註冊失敗，請重試。');
    }
  };
  

  return (
    <div className="rswrapper">
      <main className="login-register-container">
        <div className="rsform-container">
          <h2>註冊</h2>
          <form onSubmit={handleSubmit}>
            <div className="rsform-group">
              <label htmlFor="username">用戶名</label>
              <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="rsform-group">
              <label htmlFor="email">電子郵件</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="rsform-group">
              <label htmlFor="password">密碼</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="rsform-group">
              <label htmlFor="repassword">確認密碼</label>
              <input
                type="password"
                id="repassword"
                name="repassword"
                value={rePassword}
                onChange={handleRePasswordChange}
                placeholder="再次輸入密碼"
              />
            </div>
            <button type="submit">註冊</button>
          </form>
          <div className="message-container">
            {errorMessage && (
              <p key={animationKey} className="error-message shake" style={{ whiteSpace: 'pre-line' }}>
                {errorMessage}
              </p>
            )}
            {successMessage && (
              <div className="succ-message">
                <p>{successMessage}</p>
                <p>即將在 {countdown} 秒後導向至首頁...</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
