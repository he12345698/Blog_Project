import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './index0';
import LoginPage from './pages/LoginPage';
import Register from './pages/Register';
import ArticlesPage from './pages/ArticlesPage';
import SearchPage from './pages/SearchPage';
import Test1 from './Test1';
import SingleArticle from './pages/SingleArticle';
import style from './styles/App.module.css';
import UserData from './pages/UserData';
import ArticleEditor from './pages/ArticleEditor';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages//ResetPasswordPage ';
import Header from './components/Header';
import Footer from './components/Footer';
import EmailVerificationPage from './pages/EmailVerificationPage';
import ChangePassword from './pages/ChangePassword';
import UserDataReadOnly from './pages/UserDataReadOnly';
import TagPage from './pages/TagPage';

const MainLayout = ({ children }) => (
  <main className={style.App}>
    {children}
  </main>
);

const App = () => {

  return (
    <Router>
      <Header />
      <Routes>
        <Route path='/ChangePassword' element={<MainLayout><ChangePassword /></MainLayout>} />
        <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
        <Route path="/test1" element={<MainLayout><Test1 /></MainLayout>} />
        <Route path="/forgot-password" element={<MainLayout><ForgotPasswordPage /></MainLayout>} />
        <Route path="/reset-password" element={<MainLayout><ResetPasswordPage /></MainLayout>} />
        <Route path="/" element={<MainLayout><ArticlesPage /></MainLayout>} />
        <Route path="/searchPage" element={<MainLayout><SearchPage /></MainLayout>} />
        <Route path="/singleArticle/:articleId" element={<MainLayout><SingleArticle /></MainLayout>} />
        <Route path='/publish-article' element={<MainLayout><ArticleEditor /></MainLayout>} />
        <Route path="/UserData" element={<MainLayout><UserData /></MainLayout>} />
        <Route path="/edit-article/:articleId" element={<MainLayout><ArticleEditor /></MainLayout>} />
        <Route path="/verify-email" element={<MainLayout><EmailVerificationPage /></MainLayout>} />
        <Route path="/tag/:tagId" element={<MainLayout><TagPage /></MainLayout>} />
        <Route path="/UserData/:userId" element={<MainLayout><UserDataReadOnly /></MainLayout>} />
        <Route path="/login" element={<MainLayout><LoginPage /></MainLayout>} />
        {/* 你可以在這裡增加更多路由 */}
      </Routes>
      <Footer />
    </Router>
  );
}
export default App;
