import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import styles from '../styles/components/Header.module.css';
import { UserContext } from './UserContext';

const Header = () => {
  //const [username, setUsername] = useState('');
 // const [userImage, setUserImage] = useState('');
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, setUser } = useContext(UserContext);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const menuContainer = document.querySelector(`.${styles["menu-container"]}`);
      const dropdownMenu = document.querySelector(`.${styles["dropdown-menu"]}`);

      if (menuContainer && !menuContainer.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);

  const notifyLogout = async () => {
    try {
      await fetch('http://localhost:8080/blog/ac/logout-notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${window.localStorage.getItem('token')}`, // 如果需要
        },
        body: JSON.stringify({
          username: user?.username,
        }),
      });
    } catch (error) {
      console.error('登出通知失败:', error);
    }
  };

  const handleLogout = () => {
    notifyLogout();
    window.localStorage.removeItem('token');
    setTimeout(() => {
      window.location.href = '/';
    }, 100);
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://localhost:8080/blog/api/protected-endpoint', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUser({
              username: data.username || '访客1',
              userImage: data.userImage || '/Image/GG', // 设置默认头像
              email: data.email
            });
            console.log(data)
            console.log(data.username)
          } else if (response.status === 401) {
            // 如果收到 401 响应，检查是否有新的 token
            const data = await response.json();
            if (data.token) {
              // 更新本地存储中的 token
              localStorage.setItem('token', data.token);

              // 使用新的 token 重新发起请求
              return fetchUserInfo(); // 递归调用以重试请求
            } else {
              setUser({
                username: null,
                userImage: '/Image/GG' // 设置默认头像
              });
            }
          } else {
            setUser({
              username: null,
              userImage: '/Image/GG' // 设置默认头像
            });
          }
        } catch (error) {
          console.error('Error:', error);
          setUser({
            username: null,
            userImage: '/Image/GG' // 设置默认头像
          });
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
          <Link to="/UserData">帳戶管理</Link>
          <Link to="/">首頁</Link>
        </nav>
        <div className={styles["user-login-container"]}>
          {user?.username ? (
            <div className={styles["user-info"]}>
              <img
                src={user?.userImage}
                width="50"
                height="50"
                alt="User Avatar"
                className={styles["user-avatar"]}
              />
              <span className={styles.username}>
                使用者：<span className={styles["username-text"]}>{user?.username}</span>
              </span>
              <div className={styles["menu-container"]}>
                <button className={styles["hamburger-menu"]} onClick={toggleMenu}>
                  <span></span>
                  <span></span>
                  <span></span>
                </button>
                <div className={`${styles["dropdown-menu"]} ${isMenuOpen ? styles["open"] : ""}`}>
                  <Link to="/UserData">個人資料</Link>
                  <Link to="/settings">設定</Link>
                  <button onClick={handleLogout} className={styles["logout-btn"]}>
                    登出
                  </button>
                </div>
              </div>
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
