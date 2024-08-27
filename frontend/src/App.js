import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './index0';
import LoginPage from './pages/LoginPage';
import Register from './pages/Register';
import ArticlesPage from './pages/ArticlesPage';
import Test1 from './Test1';
import UserData from './pages/UserData';
import OnePage from './pages/OnePage';
import ArticleEditor from './pages/ArticleEditor';
import './styles/App.css';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './ResetPasswordPage ';
import Header from './components/Header';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
import EmailVerificationPage from './pages/EmailVerificationPage';

const App = () => {

  const [username, setUsername] = useState('');
  const [userImage, setUserImage] = useState('');

  const notifyLogout = async () => {
    try {
      await fetch('http://niceblog.myvnc.com:8080/blog/ac/logout-notify', {
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

   // 獲取用戶信息
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      console.log('Request Headers:', {
        'Authorization': `Bearer ${token}` 
      });
      if(token) {
        try {
          const response = await fetch('http://niceblog.myvnc.com:8080/api/protected-endpoint', {
          //const response = await fetch('http://localhost:8080/blog-0.0.1-SNAPSHOT/api/protected-endpoint', {
              method: 'GET',
              headers: {
                  'Authorization': `Bearer ${token}`
              }
          });
          if (response.ok) {
              const data = await response.json();
              console.log('geust is ' + data.username)
              console.log('userimage ' + data.userImage)
              setUsername(data.username || '訪客1');
              setUserImage(data.userImage || '/Image/GG'); // 默认头像
          } else {
              console.log('Response error:', response);
              //setUsername('訪客2');
              //setUserImage('/Image/default-avatar.jpg'); // 默认头像
          }
        } catch (error) {
            console.error('Error:', error);
            setUsername('Error222');
            setUserImage('/Image/GG'); // 默认头像
        }
      }
        
    };

    fetchUserInfo();
  }, []);

  return (
    <Router>
      <Header username={username} userImage={userImage} onLogout={handleLogout}/>
    <main>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/test1" element={<Test1 />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/articlesPage" element={<ArticlesPage />} />
        <Route path='/publish-article' element={<ArticleEditor />} />
        <Route path="/UserData" element={<UserData />} />
        <Route path="/onePage/:id" element={<OnePage />} /> 
        <Route path="/edit-article/:articleId" element={<ArticleEditor />} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        {/* 你可以在这里添加更多的路由 */}
      </Routes>
    </main>
    <Footer />
  </Router>
  );
};

export default App;
