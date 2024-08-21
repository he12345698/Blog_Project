import React from 'react';
import { Link } from 'react-router-dom';

import '../styles/components/Header.css';

const Header = ({ username, userImage }) => {
  return (
    <header className="top-bar">
      <div className="top-container">
        <div className="logo">xxx部落格</div>
        <nav className="navigation">
          <Link to="/allArticles">所有文章</Link>
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
