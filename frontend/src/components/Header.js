import React from 'react';
import { Link } from 'react-router-dom';

import '../styles/components/Header.css';


const Header = ({ username, userImage, onLogout }) => {

  return (
    <header className="top-bar">
      <link rel="icon" type="image/gif" href="./favicon.gif"></link>
      <div className="top-container">
        <div className="logo">xxx部落格</div>
        <nav className="navigation">
          <Link to="/articlesPage">所有文章</Link>
          <Link to="/edit-article">編輯文章</Link>
          <Link to="/publish-article">發表文章</Link>
          <Link to="/about">關於我們</Link>
          <Link to="/account">帳戶管理</Link>
          <Link to="/">首頁</Link>
        </nav>
        <div className="user-login-container">
          {username ? (
            <div className="user-info">
              <img
                src={userImage}
                width="50"
                height="50"
                alt=""
                className="user-avatar"
              />
              <span className="username">使用者：{username}</span>
              <button onClick={onLogout} className="logout-btn">登出</button>
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
