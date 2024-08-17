import React, { useState } from 'react';
import './components/Register.css';
import Header from './Header';
import Footer from './Footer';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
            // 如果相同性檢查通過，可以清除錯誤訊息
            setErrorMessage((prev) => (prev === '密碼不相同' ? '' : prev));
        }
    }, 750); // 設定 1 秒的延遲
};


const handleSubmit = async (event) => {
  event.preventDefault();
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
    // const response = await fetch('http://114.32.14.238:8080/demo/ac/register', {
      const response = await fetch('http://localhost:8080/blog-0.0.1-SNAPSHOT/ac/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (response.ok) {
      const message = await response.text(); // 讀取後端返回的訊息
      setSuccessMessage(message); // 成功訊息
      setErrorMessage(''); // 清空錯誤訊息
    } else {
      const errorMessage = await response.text(); // 讀取後端返回的錯誤訊息
      console.log('Error response:', response);
      setSuccessMessage('');
      setErrorMessage(errorMessage || '註冊失敗1，請重試。'); // 顯示錯誤訊息
    }
  } catch (error) {
      console.error('Error:', error);
      setErrorMessage('註冊失敗2，請重試。'); // 顯示錯誤訊息
    }
};

  return (
    <div className="wrapper">
      <Header />
      <main className="login-register-container">
        <div className="form-container">
          <h2>註冊</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">用戶名</label>
              <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="email">電子郵件</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">密碼</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="form-group">
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
            <div key={errorMessage} className="error-message">{errorMessage}</div>
          )}          
            <div className="succ-message">{successMessage}</div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
