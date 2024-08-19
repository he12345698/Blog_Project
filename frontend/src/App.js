import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './index0';
import LoginPage from './pages/LoginPage';
import Register from './pages/Register';
import Test1 from './Test1';

import './styles/App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/test1" element={<Test1 />} />
        {/* 你可以在这里添加更多的路由 */}
      </Routes>
    </Router>
  );
};

export default App;
