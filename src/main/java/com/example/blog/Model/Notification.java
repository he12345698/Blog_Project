package com.example.blog.Model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private AccountVo user;  // 被通知的用戶

    @ManyToOne
    @JoinColumn(name = "article_id")
    private ArticleVo article;  // 按讚的文章

    private boolean isRead = false;  // 默認未讀
    
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "content", nullable = false)
    private String content;

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public AccountVo getUser() {
		return user;
	}

	public void setUser(AccountVo user) {
		this.user = user;
	}

	public ArticleVo getArticle() {
		return article;
	}

	public void setArticle(ArticleVo article) {
		this.article = article;
	}

	public boolean isRead() {
		return isRead;
	}

	public void setRead(boolean isRead) {
		this.isRead = isRead;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
}
