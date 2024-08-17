

/* 使用者列表 */
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY, /* 使用者序號自動生成 */
    user_name VARCHAR(50) NOT NULL UNIQUE, /* 使用者名稱不得為空 */
    password VARCHAR(50) NOT NULL, /* 使用者登入密碼不得為空 */
    email VARCHAR(50), /* 使用者郵箱 */
    birth DATE, /* 使用者生日 */
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, /* 創立使用者資料當下時間 */
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP /* 更新使用者資料當下時間 */
);
/* 文章列表 */
CREATE TABLE Articles (
    article_id INT AUTO_INCREMENT PRIMARY KEY, /* 文章序號自動生成 */
    title VARCHAR(50) NOT NULL, /* 文章標題不得為空 */
    contentTEXT TEXT NOT NULL, /* 文章內容不得為空 */
    author_id INT, /* 作者序號引用Users */
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, /* 文章發布當下時間 */
    last_edited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, /* 文章更新當下時間 */
    FOREIGN KEY (author_id) REFERENCES Users(user_id)
);
/* 留言列表 */
CREATE TABLE Comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY, /* 留言序號自動生成 */
    article_id INT, /* 文章序號引用Articles */
    user_id INT, /* 使用者序號引用Users */
    contentTEXT TEXT NOT NULL, /* 留言內容不得為空 */
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, /* 評論創建當下時間 */
    FOREIGN KEY (article_id) REFERENCES Articles(article_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);
/* 標籤列表 */
CREATE TABLE Tags (
    tag_id INT AUTO_INCREMENT PRIMARY KEY, /* 標籤序號自動生成 */
    tag_name VARCHAR(50) NOT NULL UNIQUE /* 標籤名稱不得為空 */
);
/* 標籤分類列表 */
CREATE TABLE Article_Tags (
    article_id INT,  /* 文章序號引用Articles */
    tag_id INT,  /* 標籤序號引用Tags */
    PRIMARY KEY (article_id, tag_id),
    FOREIGN KEY (article_id) REFERENCES Articles(article_id),
    FOREIGN KEY (tag_id) REFERENCES Tags(tag_id)
);