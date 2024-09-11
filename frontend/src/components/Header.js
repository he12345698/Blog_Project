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
      const token = localStorage.getItem('token'); // 從本地存儲獲取 token
      if (token) {
        try {
          // const response = await fetch('http://niceblog.myvnc.com:8080/blog/api/protected-endpoint', {
            const response = await fetch('http://localhost:8080/blog/api/protected-endpoint', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`, // 將 token 作為 Authorization header 發送
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUser({
              username: data.username || '未登入',
              userImage: data.userImage || '/Image/GG', // 設置默認頭像
              email: data.email,
              id: data.id,
              password: data.password
            });
            console.log('data at header is ',data);
          } else if (response.status === 401) {
            // 如果收到 401 響應，檢查是否有新的 token
            const data = await response.json();
            if (data.token) {
              // 更新本地存儲中的 token
              localStorage.setItem('token', data.token);

              // 使用新的 token 重新發起請求
              return fetchUserInfo(); // 遞歸調用以重試請求
            } else {
              setUser({
                username: null,
                userImage: '/Image/GG' // 設置默認頭像
              });
            }
          } else {
            setUser({
              username: null,
              userImage: '/Image/GG' // 設置默認頭像
            });
          }
        } catch (error) {
          console.error('Error:', error);
          setUser({
            username: null,
            userImage: '/Image/GG' // 設置默認頭像
          });
        }
      }
    };

    fetchUserInfo(); // 初始化時調用函數來設置用戶信息
  }, [location, setUser]); // location 改變時重新執行

  return (
    <header className={styles["top-bar"]}>
      <div className={styles["top-container"]}>
        <div className={styles.logo}>NICE BLOG</div>
        <nav className={styles.navigation}>
          <Link to="/edit-article" className={styles.navigation}>編輯文章</Link>
          <Link to="/publish-article" className={styles.navigation}>發表文章</Link>
          <Link to="/about" className={styles.navigation}>關於我們</Link>
          <Link to="/UserData" className={styles.navigation}>帳戶管理</Link>
          <Link to="/" className={styles.navigation}>首頁</Link>
        </nav>
        <div className={styles["user-login-container"]}>
          {user?.username ? (
            <div className={styles["user-info"]}>
              <a href="/UserData">
              <img
                src={user?.userImage}
                width="50"
                height="50"
                alt="User Avatar"
                className={styles["user-avatar"]}
              />
              </a>
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
