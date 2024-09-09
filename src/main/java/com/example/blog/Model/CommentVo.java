package com.example.blog.Model;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "comment")
public class CommentVo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;

    @ManyToOne
    @JoinColumn(name = "author_id")  // 外鍵對應到 AccountVo 表中的 id
    private AccountVo author;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "article_id") // 外鍵名稱，指向 ArticleVo 表中的主鍵
    private ArticleVo article;  // 將 Optional<ArticleVo> 改為 ArticleVo

    private int likes = 0;

    @ManyToMany
    @JoinTable(
        name = "comment_likes",
        joinColumns = @JoinColumn(name = "comment_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<AccountVo> likedBy = new HashSet<>();

    public CommentVo() {
        this.createdAt = LocalDateTime.now();
    }

    // Getters 和 Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public AccountVo getAuthor() {
        return author;
    }

    public void setAuthor(AccountVo author) {
        this.author = author;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public ArticleVo getArticle() {
        return article;
    }

    public void setArticle(ArticleVo article) {
        this.article = article;
    }

    public int getLikes() {
        return likes;
    }

    public void setLikes(int likes) {
        this.likes = likes;
    }

    public Set<AccountVo> getLikedBy() {
        return likedBy;
    }

    public void setLikedBy(Set<AccountVo> likedBy) {
        this.likedBy = likedBy;
    }
}
