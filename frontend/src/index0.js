import { Link } from 'react-router-dom';
import './styles/pages/Index.css';
import Footer from './components/Footer';

const Index = () => {

  return (
    <div className="wrapper">
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
          <Link to="/">
            <a>尾頁</a>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Index;
