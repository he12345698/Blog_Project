import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';



const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [animationKey, setAnimationKey] = useState(Date.now());

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAnimationKey(Date.now()); 
    try {
      const response = await fetch('http://114.32.14.238:8080/blog/ac/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Token from response body:', data.token);
        localStorage.setItem('token', data.token);
        const token = response.headers.get('Authorization')?.split(' ')[1];
        if (token) {
          localStorage.setItem('token', token);
        }
        navigate('/');
      } else {
        const error = await response.json();
        setErrorMessage(error.message || '登入失敗，請重試。');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('伺服器發生錯誤，請稍後重試。');
    }
  };

  return (
    <div className="login-container">
      <div className="form-container">
        <h2>登入</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">使用者名稱</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">密碼</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" onClick={() => setCount(count + 1)}>登入</button>
          <div className="error-placeholder">
            {errorMessage && (
            <p key={animationKey} className="error-message shake" style={{ whiteSpace: 'pre-line' }}>
              {errorMessage}
            </p>
          )}
          </div>
        </form>
        <p>還沒有帳號嗎？<a href="/register">註冊一個吧</a></p>
      </div>
    </div>
  );
};

export default LoginPage;
