package com.example.blog;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

// 註解為 JPA 實體類別，對應到資料庫中的 article 表
@Entity
@Table(name = "Articles2")
public class Articles2 {

    // 設定主鍵，並指定自動生成策略為自增
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long article_id;

    // 文章標題s
    private String title;

    // 文章內容
    private String contentTEXT;

    // 文章作者
    private String author_id;

    public Long getArticle_id() {
        return article_id;
    }

    public void setArticle_id(Long article_id) {
        this.article_id = article_id;
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

    public String getAuthor_id() {
        return author_id;
    }

    public void setAuthor_id(String author_id) {
        this.author_id = author_id;
    }

    // 文章標籤，以逗號分隔的標籤字串
    //private String tags;

    // 文章點讚數
    //private int likesCount;

    // Getter 和 Setter 方法

}
   