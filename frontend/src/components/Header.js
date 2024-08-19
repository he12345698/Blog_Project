import React from 'react';
import '../styles/components/Header.css';

const Header = ({ username, userImage }) => {
  return (
    <header className="top-bar">
      <div className="top-container">
        <div className="logo">xxx部落格</div>
        <nav className="navigation">
          <a href="/">首頁</a>
          <a href="#">文章</a>
          <a href="#">關於我們</a>
          <a href="#">聯絡我們</a>
        </nav>
        <div className="user-login-container">
          {username ? (
            <div className="user-info">
              <img
                src={userImage || '/Image/default-avatar.jpg'} // 默認頭像
                width="50"
                height="50"
                alt=""
                className="user-avatar"
              />
              <span className="username">使用者：{username}</span>
            </div>
          ) : (
            <div className="login-btn">
              <button onClick={() => window.location.href = '/login'}>登入</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
