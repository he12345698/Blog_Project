package com.example.blog;

import java.time.LocalDateTime;

import com.example.blog.Model.AccountVo;
import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

// 註解為 JPA 實體類別，對應到資料庫中的 article 表
@Entity
@Table(name = "articles2")
public class Articles2 {

    // 設定主鍵，並指定自動生成策略為自增
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 文章標題
    @Column(name = "title", length = 255, nullable = true)
    private String title;

    // 文章內容
    @Column(name = "content_text", length = 255, nullable = true)
    private String content_text;

    // 文章作者
    @ManyToOne
    @JoinColumn(name = "author_id",referencedColumnName = "id")
    private AccountVo accountVo;

    // 發表時間
    @Column(name = "publishedDate")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime publishedDate;

    // 最後編輯日期
    @Column(name = "lastEditedDate")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime lastEditedDate;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent_text() {
        return content_text;
    }

    public void setContent_text(String contentText) {
        this.content_text = contentText;
    }

    public AccountVo getAccountVo() {
        return accountVo;
    }

    public void setAccountVo(AccountVo accountVo) {
        this.accountVo = accountVo;
    }

    public LocalDateTime getPublishedDate() {
        return publishedDate;
    }

    public void setPublishedDate(LocalDateTime publishedDate) {
        this.publishedDate = publishedDate;
    }

    public LocalDateTime getLastEditedDate() {
        return lastEditedDate;
    }

    public void setLastEditedDate(LocalDateTime lastEditedDate) {
        this.lastEditedDate = lastEditedDate;
    }


}
   
