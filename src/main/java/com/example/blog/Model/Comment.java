package com.example.blog.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

// 註解為 JPA 實體類別，對應到資料庫中的 comment 表
@Entity
public class Comment {

    // 設定主鍵，並指定自動生成策略為自增
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 文章ID，表示這條評論所屬的文章
    private Long articleId;

    // 評論內容
    private String content;

    // 評論作者
    private String author;

    // 評論創建時間
    private String createdAt;

    // Getter 和 Setter 方法
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getArticleId() {
        return articleId;
    }

    public void setArticleId(Long articleId) {
        this.articleId = articleId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}
