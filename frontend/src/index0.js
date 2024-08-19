import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './components/Index.css';
import Header from './Header';
import Footer from './Footer';

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [userImage, setUserImage] = useState('');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const notifyLogout = async () => {
    try {
      await fetch('http://114.32.14.238:8080/blog/ac/logout-notify', {
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
  
  // 獲取用戶信息
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      console.log('Request Headers:', {
        'Authorization': `Bearer ${token}`
      });
      if(token) {
        try {
          const response = await fetch('http://114.32.14.238:8080/blog/api/protected-endpoint', {
              method: 'GET',
              headers: {
                  'Authorization': `Bearer ${token}`
              }
          });

          if (response.ok) {
              const data = await response.json();
              console.log('geust is ' + data.username)
              setUsername(data.username || '訪客1');
              setUserImage(data.userImage || '/Image/GG'); // 默认头像
          } else {
              console.log('Response error:', response);
              //setUsername('訪客2');
              //setUserImage('/Image/default-avatar.jpg'); // 默认头像
          }
        } catch (error) {
            console.error('Error:', error);
            setUsername('Error');
            setUserImage('/Image/GG'); // 默认头像
        }
      }
        
    };

    fetchUserInfo();
}, []);

  return (
    <div className="wrapper">
      <Header username={username} userImage={userImage} onLogout={handleLogout}/>
      <main className="content">
        <div className="container">
          <div className="search-bar">
            <input type="text" placeholder="搜尋..." aria-label="搜尋" />
            <button type="button">搜尋</button>
          </div>
          <div className="hashtag">財金/政治/體育/國際/美食/遊戲</div>
          <div className="hashtag">
            <a className="hash">熱搜標籤 :</a>
            <span>財金</span>
            <span>政治</span>
            <span>體育</span>
            <span>國際</span>
            <span>美食</span>
            <span>遊戲</span>
          </div>
        </div>

        <div className="post-container">
          <div className="post">作者 : abc | 貼文 : 冰島火山爆發?! | 08/02</div>
          <div className="post">作者 : abc | 貼文 : 奧運射擊比賽亞軍是土耳其殺手?! | 08/02</div>
          <div className="post">作者 : abc | 貼文 : 小戴搭經濟艙?! | 08/02</div>
          <div className="post">作者 : abc | 貼文 : 冰島火山爆發?! | 08/02</div>
        </div>

        <div className="pagination">
          <a href="#">首頁</a>
          <a href="#">1</a>
          <a href="#">2</a>
          <a href="#">3</a>
          <a href="#">4</a>
          <a href="#">5</a>
          <Link to="/register">
            <a>尾頁</a>
          </Link>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-container">
          <p>&copy; 2024 xxx部落格 版權所有.</p>
        </div>
      </footer>

      {/* Modal */}
      {isModalOpen && (
        <div id="loginModal" className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>登入</h2>
            <form id="loginForm">
              <label htmlFor="username">使用者名稱:</label>
              <input type="text" id="username" name="username" required /><br />
              <label htmlFor="password">密碼:</label>
              <input type="password" id="password" name="password" required /><br />
              <button type="submit">登入</button>
            </form>
            <a>還沒有帳號?</a>
            <Link to="/register">
              <a>註冊</a>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
