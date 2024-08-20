import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './LoginPage.css';
import Maintenanceheader from '../../Maintenanceheader';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [animationKey, setAnimationKey] = useState(Date.now());
  const [searchParams] = useSearchParams();

  // 用於處理登入邏輯
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
        localStorage.setItem('token', data.token);
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

  useEffect(() => {
    const initialUsername = searchParams.get('username');
    const initialPassword = searchParams.get('password');
  
    if (initialUsername && initialPassword) {
      fetch('http://114.32.14.238:8080/blog/ac/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: initialUsername,
          password: initialPassword,
        }),
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Login failed');
      })
      .then(data => {
        localStorage.setItem('token', data.token);
        navigate('/');
      })
      .catch(error => {
        setErrorMessage(error.message || '登入失敗，請重試。');
      });
    }
  }, [searchParams, navigate]);

  return (
    <div className="login-container">
      <Maintenanceheader />{/* 系統維護中跑馬燈 */}
      <div className="loginform-container">
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
          <button type="submit">登入</button>
          <div className="error-placeholder">
            {errorMessage && (
              <p key={animationKey} className="error-message shake" style={{ whiteSpace: 'pre-line' }}>
                {errorMessage}
              </p>
            )}
          </div>
        </form>
        <div className="login-footer">
          <p>
            還沒有帳號嗎？<a href="/register">註冊一個吧！</a>
          </p>
          <a href="/forgot-password" className="forgot-password">忘記密碼？</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
