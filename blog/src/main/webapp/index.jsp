<%@ page contentType="text/html; charset=UTF-8" %>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>XXX部落格</title>
    <link rel="stylesheet" type="text/css" href="/blog/resourse/css/Index.css">
</head>
<body>
    <!-- 頂部功能列 -->
    <header class="top-bar">
        <div class="top-container">
            <div class="logo">xxxX部落格</div>
            <nav class="navigation">
                <a href="index.jsp">首頁</a>
                <a href="#">文章</a>
                <a href="#">關於我們</a>
                <a href="#">聯絡我們</a>
            </nav>
            <div class="user-login-container">
                <div class="user-info">
                    <img src="/blog/resourse/Image/IMG_20240701_124913.JPG" width="50" height="50" alt="使用者頭像" class="user-avatar">
                    <span class="username">虎斑貓</span>
                </div>
                <div class="login-btn">
                    <button onclick="location.href='login.jsp'">登入</button>
                </div>
            </div>
        </div>
    </header>

    <!-- 搜尋列跟熱門標籤 -->
    <main class="content">
        <div class="container">
            <div class="search-bar">
                <input type="text" placeholder="搜尋..." aria-label="搜尋">
                <button type="button">搜尋</button>
            </div>
            <div class="hashtag">財金/政治/體育/國際/美食/遊戲</div>
            <div class="hashtag">
               <a class="hash">熱搜標籤 :</a> 
                <span>財金</span>
                <span>政治</span>
                <span>體育</span>
                <span>國際</span>
                <span>美食</span>
                <span>遊戲</span>
            </div>
        </div>

        <!-- 文章容器 -->
        <div class="post-container">
            <div class="post">作者 : abc | 貼文 : 冰島火山爆發?! | 08/02</div>
            <div class="post">作者 : abc | 貼文 : 奧運射擊比賽亞軍是土耳其殺手?! | 08/02</div>
            <div class="post">作者 : abc | 貼文 : 小戴搭經濟艙?! | 08/02</div>
            <div class="post">作者 : abc | 貼文 : 冰島火山爆發?! | 08/02</div>

            <!-- 可以繼續添加更多文章容器 -->
        </div>

        <!-- 分頁導航 -->
        <div class="pagination">
            <a href="#">首頁</a>
            <a href="#">1</a>
            <a href="#">2</a>
            <a href="#">3</a>
            <a href="#">4</a>
            <a href="#">5</a>
            <a href="#">尾頁</a>
        </div>
    </main>

    <!-- 頁腳 -->
    <footer class="footer">
        <div class="footer-container">
            <p>&copy; 2024 xxx部落格 版權所有.</p>
        </div>
    </footer>
</body>
</html>
