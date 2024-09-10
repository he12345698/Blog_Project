import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../styles/pages/LoginPage.css';
import Maintenanceheader from '../components/Maintenanceheader';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState(''); // 用戶輸入的驗證碼
  const [captchaUrl, setCaptchaUrl] = useState(''); // CAPTCHA 圖片的 URL
  const [errorMessage, setErrorMessage] = useState('');
  const [animationKey, setAnimationKey] = useState(Date.now());
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [rePassword, setRePassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [countdown, setCountdown] = useState(3); // 倒數計時初始值（秒）
  const [email, setEmail] = useState('');

  // 加載驗證碼圖片
  const loadCaptcha = async () => {
    try {

      // const response = await fetch('http://niceblog.myvnc.com:8080/blog/ac/captcha', {
      const response = await fetch('http://localhost:8080/blog/ac/captcha', {
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

  }, [searchParams, navigate]);

  // 用於處理登入邏輯
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAnimationKey(Date.now());
    try {
      // const response = await fetch('http://niceblog.myvnc.com:8080/blog/ac/login', {
        const response = await fetch('http://localhost:8080/blog/ac/login', {
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
/*  註冊  */ 
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordLength(newPassword);
    // 這裡不直接檢查相同性，因為可能還沒輸入確認密碼
  };

  // const handleRePasswordChange = (e) => {
  //   const newRePassword = e.target.value;
  //   setRePassword(newRePassword);
  //   checkPasswordsMatch(password, newRePassword);
  // };

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
  //if (!rePassword) missingFields.push('確認密碼');
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
    <div class="section">
      <div class="container">
        <div class="row full-height justify-content-center">
          <div class="col-12 text-center align-self-center py-5">
            <div class="section pb-5 pt-5 pt-sm-2 text-center">
              <h6 class="mb-0 pb-3"><span>Log In </span><span>Sign Up</span></h6>
              <input class="checkbox" type="checkbox" id="reg-log" name="reg-log" />
              <label for="reg-log"></label>
              <div class="card-3d-wrap mx-auto">
                <div class="card-3d-wrapper">
                  <div class="card-front">
                    <div class="center-wrap">
                      <div class="section text-center">
                        <h4 class="mb-4 pb-3">Log In</h4>
                        <div class="form-group">
                          <input type="text" name="username" class="form-style" placeholder="Your Username" id="username" autocomplete="off" value={username}
                            onChange={(e) => setUsername(e.target.value)} />
                          <i class="input-icon uil uil-at"></i>
                        </div>
                        <div class="form-group mt-2">
                          <input type="password" name="logpass" class="form-style" placeholder="Your Password" id="logpass" autocomplete="off" value={password}
                            onChange={(e) => setPassword(e.target.value)} />
                          <i class="input-icon uil uil-lock-alt"></i>
                        </div>
                        <div className="captcha-container">
                          <label htmlFor="captcha" className="capt">驗證碼</label>
                          <img
                            src={captchaUrl}
                            alt="captcha"
                            className="captcha-image"
                            onClick={loadCaptcha}
                          />
                          <button type="button" className="btn2 mt-4" onClick={loadCaptcha}>
                            <i className="uil uil-sync"></i> 刷新驗證碼
                          </button>
                        </div>
                        <div class="form-group mt-3">
                          <input type="text" name="captcha" class="form-style" placeholder="Enter Captcha" id="captcha" autocomplete="off" value={captcha}
                            onChange={(e) => setCaptcha(e.target.value)} />
                          <i class="input-icon uil uil-picture"></i>
                        </div>
                        <button class="btn mt-3" onClick={handleLoginSubmit}>登入</button>
                        <p class="mb-0 mt-4 text-center"><a href="/forgot-password" class="link">Forgot your password?</a></p>
                      </div>
                    </div>
                  </div>
                  <div class="card-back">
                    <div class="center-wrap">
                      <div class="section text-center">
                        <h4 class="mb-4 pb-3">Sign Up</h4>
                        <div class="form-group">
                          <input type="text" name="logname" class="form-style" placeholder="Your Full Name" id="logname" autocomplete="off" onChange={(e) => setUsername(e.target.value)} />
                          <i class="input-icon uil uil-user"></i>
                        </div>
                        <div class="form-group mt-2">
                          <input type="email" name="logemail" class="form-style" placeholder="Your Email" id="logemail" autocomplete="off" onChange={(e) => setEmail(e.target.value)}/>
                          <i class="input-icon uil uil-at"></i>
                        </div>
                        <div class="form-group mt-2">
                          <input type="password" name="logpass" class="form-style" placeholder="Your Password" id="logpass" autocomplete="off" onChange={handlePasswordChange}/>
                          <i class="input-icon uil uil-lock-alt"></i>
                        </div>
                        <div className="error-placeholder">
                          {errorMessage && (
                            <p key={animationKey} className="error-message shake" style={{ whiteSpace: 'pre-line' }}>
                              {errorMessage}
                            </p>
                          )}
                        </div>
                        <a href="#" class="btn mt-4" onClick={handleSubmit}>submit</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
