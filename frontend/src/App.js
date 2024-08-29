import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './index0';
import LoginPage from './pages/LoginPage';
import Register from './pages/Register';
import ArticlesPage from './pages/ArticlesPage';
import Test1 from './Test1';
import SingleArticle from './pages/SingleArticle';
import './styles/App.css';
import UserData from './pages/UserData';
import ArticleEditor from './pages/ArticleEditor';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './ResetPasswordPage ';
import Header from './components/Header';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
import EmailVerificationPage from './pages/EmailVerificationPage';
import { useLocation } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';



const App = () => {
  // const isLoginPage = window.location.pathname === '/login';
  // const location = useLocation(); // 获取当前路径
  // const [animationKey, setAnimationKey] = useState('');

  // useEffect(() => {
  //   // 检查当前路径是否是登录页面并更新 CSS 类
  //   const isLoginPage = window.location.pathname === '/login';
  //   const mainElement = document.querySelector('main');
  //   setAnimationKey(Date.now());
  //   if (mainElement) {
  //     if (isLoginPage) {
  //       mainElement.classList.add('no-margin');
  //     } else {
  //       mainElement.classList.remove('no-margin');
  //     }
  //   }
  // }, []); // 当路径发生变化时触发 useEffect

  const [mainClass, setMainClass] = useState('');

  useEffect(() => {
    if (window.location.pathname === '/login') {
      setMainClass('no-margin');
    } else {
      setMainClass('');
    }
    // 清理样式或者其他副作用
    return () => {
      // 可以在这里执行样式清理操作
    };
  }, [window.location.pathname]); // 监听路径变化

  return (
    <Router>
      <Header />
      <main className={mainClass}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/test1" element={<Test1 />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/articlesPage" element={<ArticlesPage />} />
          <Route path="/singleArticle/:articleId" element={<SingleArticle />} />
          <Route path='/publish-article' element={<ArticleEditor />} />
          <Route path="/UserData" element={<UserData />} />
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
