package com.example.blog.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
@Entity
@Table(name = "article_vo")
@EntityListeners(AuditingEntityListener.class)// 啟用審計功能
public class ArticleVo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long author_id;
    private String title;
    private String contentTEXT;
    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime published_at;
    @LastModifiedDate
    private LocalDateTime last_edited_at;
    // Getters and setters
    public Long getid() {
        return id;
    }
    public void setid(Long id) {
        this.id = id;
    }
    public Long getAuthor_id() {
        return author_id;
    }
    public void setAuthor_id(Long author_id) {
        this.author_id = author_id;
    }
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public String getContentTEXT() {
        return contentTEXT;
    }
    public void setContentTEXT(String contentTEXT) {
        this.contentTEXT = contentTEXT;
    }
    public LocalDateTime getPublished_at() {
        return published_at;
    }
    public void setPublished_at(LocalDateTime published_at) {
        this.published_at = published_at;
    }
    public LocalDateTime getLast_edited_at() {
        return last_edited_at;
    }
    public void setLast_edited_at(LocalDateTime last_edited_at) {
        this.last_edited_at = last_edited_at;
    }
    @Override
    public String toString() {
        return "ArticleVo [article_id=" + id + ", author_id=" + author_id + ", title=" + title
                + ", contentTEXT=" + contentTEXT + ", published_at=" + published_at + ", last_edited_at="
                + last_edited_at + "]";
    }
    
}
