import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import styles from '../styles/components/Header.module.css';
import { UserContext } from './UserContext';
import { connectWebSocket, disconnectWebSocket } from '../services/websocketClient'; // 更新为你的路径
import '../styles/components/notification.scss'
import { fetchUnreadNotifications } from '../services/NotificationService';

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const [unreadCount, setUnreadCount] = useState(0); // 未读通知数量
  const bellRef = useRef(null);
  const menuRef = useRef(null);


  useEffect(() => {
    if (user) {
      // 获取初始未读通知
      fetchUnreadNotifications(user?.id).then(data => {
        setNotifications(data);
        setUnreadCount(data.length)
      }).catch(error => {
        console.error('获取未读通知失败:', error);
      });

      // 连接 WebSocket
      const handleMessage = (message) => {
        // 处理收到的通知
        setNotifications(prevNotifications => [...prevNotifications, message]);
        fetchUnreadNotifications(user?.id).then(data => {
          setNotifications(data);
          setUnreadCount(data.length)
        }).catch(error => {
          console.error('获取未读通知失败:', error);
        });

        triggerAnimation();
      };

      connectWebSocket(user?.id, handleMessage);

      // 清理 WebSocket 连接
      return () => {
        disconnectWebSocket();
      };
    }
  }, [user?.id]);

  const markNotificationAsRead = async (notificationId) => {
    try {
      const response = await fetch(`http://niceblog.myvnc.com:8080/blog/notifications/read/${notificationId}`, {
      //const response = await fetch(`http://niceblog.myvnc.com:8080/blog/notifications/read/${notificationId}`, {
        method: 'POST',
      });
      if (response.ok) {
        // 更新通知状态或从通知列表中移除已读通知
        setNotifications(prevNotifications =>
          prevNotifications.filter(notification => notification.id !== notificationId)
        );
        setUnreadCount(prevCount => Math.max(prevCount - 1, 0)); // 更新未读数量
        
      } else {
        console.error('标记通知为已读失败');
      }
    } catch (error) {
      console.error('网络错误:', error);
    }
  };

  useEffect(() => {
    console.log('Unread count changed:', unreadCount);
  }, [unreadCount]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleNotifications = () => {
    fetchUnreadNotifications(user?.id).then(data => {
      setNotifications(data);
      setUnreadCount(data.length)
    }).catch(error => {
      console.error('获取未读通知失败:', error);
    });
    setShowNotifications((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const menuContainer = document.querySelector(`.${styles["menu-container"]}`);
      const dropdownMenu = document.querySelector(`.${styles["dropdown-menu"]}`);
      const notificationsDropdown = document.querySelector(`.${styles["notifications-dropdown"]}`);

      if (menuContainer && !menuContainer.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (notificationsDropdown && !notificationsDropdown.contains(event.target)) {
        setShowNotifications(false);
      }
      if (bellRef.current && !bellRef.current.contains(event.target) &&
        menuRef.current && !menuRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const triggerAnimation = () => {
    const bellIcon = document.querySelector('.bell-icon');
    const notificationAmount = document.querySelector('.notification-amount');
    if (bellIcon) {
      bellIcon.classList.add('animate');
      setTimeout(() => {
        bellIcon.classList.remove('animate');
      }, 2300); // Duration of the animation
    }
    if (notificationAmount) {
      notificationAmount.style.opacity = '1';
      notificationAmount.style.visibility = 'visible';
    }
  };

  const notifyLogout = async () => {
    try {
      await fetch('http://niceblog.myvnc.com:8080/blog/ac/logout-notify', {
      //await fetch('http://niceblog.myvnc.com:8080/blog/ac/logout-notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${window.localStorage.getItem('token')}`,
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
          const response = await fetch('http://niceblog.myvnc.com:8080/blog/api/protected-endpoint', {
          //const response = await fetch('http://niceblog.myvnc.com:8080/blog/api/protected-endpoint', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUser({
              username: data.username || '未登入',
              userImage: data.userImage || 'http://niceblog.myvnc.com:81/UserImages/Guest.png',
              email: data.email,
              id: data.id,
              password: data.password,
            });
          } else if (response.status === 401) {
            const data = await response.json();
            if (data.token) {
              localStorage.setItem('token', data.token);
              return fetchUserInfo();
            } else {
              setUser({
                username: null,
                userImage: '/Image/GG',
              });
            }
          } else {
            setUser({
              username: null,
              userImage: '/Image/GG',
            });
          }
        } catch (error) {
          console.error('Error:', error);
          setUser({
            username: null,
            userImage: '/Image/GG',
          });
        }
      }
    };

    fetchUserInfo();
  }, [location, setUser]);

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
        <div className="header">
          <div className="bell-icon" tabindex="0" ref={bellRef} onClick={toggleNotifications}>
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="50px" height="30px" viewBox="0 0 50 30" enable-background="new 0 0 50 30" xmlSpace="preserve">
              <g className="bell-icon__group">
                <path className="bell-icon__ball" id="ball" fill-rule="evenodd" stroke-width="1.5" clip-rule="evenodd" fill="none" stroke="#currentColor" stroke-miterlimit="10" d="M28.7,25 c0,1.9-1.7,3.5-3.7,3.5s-3.7-1.6-3.7-3.5s1.7-3.5,3.7-3.5S28.7,23,28.7,25z" />
                <path className="bell-icon__shell" id="shell" fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" stroke="#currentColor" stroke-width="2" stroke-miterlimit="10" d="M35.9,21.8c-1.2-0.7-4.1-3-3.4-8.7c0.1-1,0.1-2.1,0-3.1h0c-0.3-4.1-3.9-7.2-8.1-6.9c-3.7,0.3-6.6,3.2-6.9,6.9h0 c-0.1,1-0.1,2.1,0,3.1c0.6,5.7-2.2,8-3.4,8.7c-0.4,0.2-0.6,0.6-0.6,1v1.8c0,0.2,0.2,0.4,0.4,0.4h22.2c0.2,0,0.4-0.2,0.4-0.4v-1.8 C36.5,22.4,36.3,22,35.9,21.8L35.9,21.8z" />
              </g>
            </svg>
            <div className={`notification-amount ${unreadCount === 0 ? 'hidden' : ''}`}>
              <span>{notifications.length > 0 && <span className="notification-badge">{notifications.length}</span>}</span>
            </div>
          </div>
          <div className={`notifications-menu ${showNotifications ? 'open' : ''}`} ref={menuRef}>
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <div key={notifications[index].id} className="notification-item" onClick={() => markNotificationAsRead(notifications[index].id)}>
                  {notification.content}
                </div>
              ))
            ) : (
              <div className="notification-item">沒有新通知</div>
            )}
          </div>
        </div>
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
