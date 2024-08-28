import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../styles/pages/LoginPage.css';
import Maintenanceheader from '../Maintenanceheader';
import { FaSync } from 'react-icons/fa';

const LoginPage = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState(''); // 用戶輸入的驗證碼
  const [captchaUrl, setCaptchaUrl] = useState(''); // CAPTCHA 圖片的 URL
  const [errorMessage, setErrorMessage] = useState('');
  const [animationKey, setAnimationKey] = useState(Date.now());
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  // 加載驗證碼圖片
  const loadCaptcha = async () => {
    try {
      const response = await fetch('http://niceblog.myvnc.com:8080/blog/ac/captcha', {
      //const response = await fetch('http://localhost:8080/blog/ac/captcha', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include' // 包含凭证 (Cookies)
      });
  
      if (response.ok) {
        // 将响应的 Blob 对象转换为 URL
        const blob = await response.blob();
        const captchaUrl = URL.createObjectURL(blob);
        
        // 更新图片的 src 属性
        setCaptchaUrl(captchaUrl);
      } else {
        console.error('Failed to load captcha:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching captcha:', error);
    }
  };

  useEffect(() => {
    // 初始化載入 CAPTCHA 圖片
    loadCaptcha();

    const handleMouseMove = (e) => {
    setCursorPosition({ x: e.pageX, y: e.pageY });
    }
    document.addEventListener('mousemove', handleMouseMove);


    const initialUsername = searchParams.get('username');
    const initialPassword = searchParams.get('password');
  
    if (initialUsername && initialPassword) {
      fetch('http://niceblog.myvnc.com:8080/blog/ac/login', {
      //fetch('http://localhost:8080/blog-0.0.1-SNAPSHOT/ac/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: initialUsername,
          password: initialPassword,
          //captcha: captcha,
        }),
        //credentials: 'include',
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

  // 用於處理登入邏輯
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAnimationKey(Date.now());
    try {
      const response = await fetch('http://niceblog.myvnc.com:8080/blog/ac/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
          captcha: captcha, // 添加 captcha 驗證碼
        }),
        credentials: 'include',
      });

      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        navigate('/');
      } else {
        const error = await response.json();
        setErrorMessage(error.message || '登入失敗，請重試。');
        // 失敗後刷新驗證碼
        loadCaptcha();
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('伺服器發生錯誤，請稍後重試。');
      // 伺服器錯誤時刷新驗證碼
      loadCaptcha();
    };
  };

  return (
    <div className="login-container">
      <div
        className="custom-cursor"
        style={{ left: `${cursorPosition.x}px`, top: `${cursorPosition.y}px` }}
      ></div>
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
          <div className="form-group captcha-group">
          <div className="captcha-container">
            <img
              src={captchaUrl}
              alt="captcha"
              className="captcha-image"
              onClick={loadCaptcha}
            />
            <button
              type="button"
              className="refresh-button"
              onClick={loadCaptcha}
              aria-label="刷新验证码"
            >
              <FaSync />
            </button>
          </div>
          <div className="form-group">
            <label htmlFor="captcha">驗證碼</label>
            <input
              type="text"
              id="captcha"
              name="captcha"
              value={captcha}
              onChange={(e) => setCaptcha(e.target.value)}
              required
            />
          </div>
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
