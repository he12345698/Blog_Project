import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import styles from '../styles/components/Header.module.css';


const Header = () => {

  const [username, setUsername] = useState('');
  const [userImage, setUserImage] = useState('');
  const location = useLocation();

  const notifyLogout = async () => {
    try {
      await fetch('http://192.168.50.38:8080/blog/ac/logout-notify', {
        //await fetch('http://localhost:8080/blog-0.0.1-SNAPSHOT/ac/logout-notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${window.localStorage.getItem('token')}`, // 如果需要
        },
        body: JSON.stringify({
          username: username,
        }),
      });
    } catch (error) {
      console.error('登出通知失败:', error);
    }
  };

  const handleLogout = () => {
    notifyLogout();
    // 处理登出逻辑，例如清除本地存储的 token，重定向到登录页面等
    window.localStorage.removeItem('token');
    //setUsername('未登入');
    setTimeout(() => {
      window.location.href = '/';
    }, 100);
  };

  // 获取用户信息
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://192.168.50.38:8080/blog/api/protected-endpoint', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            console.log('username is:', data.username);
            console.log('userImage is:', data.userImage);
            setUsername(data.username || '訪客1');
            setUserImage(data.userImage || '/Image/GG'); // 默认头像
          } else {
            console.log('Response error:', response);
          }
        } catch (error) {
          console.error('Error:', error);
          setUsername('Error222');
          setUserImage('/Image/GG'); // 默认头像
        }
      }
    };

    fetchUserInfo();
  }, [location]);

  return (
    <header className={styles["top-bar"]}>
      <div className={styles["top-container"]}>
        <div className={styles.logo}>xxx部落格</div>
        <nav className={styles.navigation}>
          <Link to="/articlesPage">所有文章</Link>
          <Link to="/edit-article">編輯文章</Link>
          <Link to="/publish-article">發表文章</Link>
          <Link to="/about">關於我們</Link>
          <Link to="/account">帳戶管理</Link>
          <Link to="/">首頁</Link>
        </nav>
        <div className={styles["user-login-container"]}>
          {username ? (
            <div className={styles["user-info"]}>
              <img
                src={userImage}
                width="50"
                height="50"
                alt="User Avatar"
                className={styles["user-avatar"]}
              />
              <span className={styles.username}>使用者：{username}</span>
              <button onClick={handleLogout} className={styles["logout-btn"]}>登出</button>
            </div>
          ) : (
            <div className={styles["login-btn"]}>
              <button onClick={() => window.location.href = '/login'}>登入</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
