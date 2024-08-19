import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles/pages/Index.css';
import Header from './components/Header';
import Footer from './components/Footer';

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [userImage, setUserImage] = useState('');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // 獲取用戶信息
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // const response = await fetch('http://114.32.14.238:8080/demo/ac/session', {
          const response = await fetch('http://localhost:8080/blog-0.0.1-SNAPSHOT/ac/session', {
          method: 'GET',
          credentials: 'include', // 確保請求攜帶 Session
          headers: {
            'Content-Type': 'application/json',
        },
        });

        if (response.ok) {
          const data = await response.text();
          setUsername(data.username || 'Guest1');
          setUserImage(data.userImage || '/Image/default-avatar.jpg'); // 默認頭像
        } else {
          console.log(response)
          setUsername('Guest2');
          setUserImage('/Image/default-avatar.jpg');
        }
      } catch (error) {
        console.error('Error:', error);
        setUsername('Error');
        setUserImage('/Image/default-avatar.jpg');
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <div className="wrapper">
      <Header username={username} userImage={userImage} />
      <main className="content">
        <div className="container">
          <div className="search-bar">
            <input type="text" placeholder="搜尋..." aria-label="搜尋" />
            <button type="button">搜尋</button>
          </div>
          <div className="hashtag">財金/政治/體育/國際/美食/遊戲//</div>
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
