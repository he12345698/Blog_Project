package com.example.blog.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "ArticleTag")
public class ArticleTag {


    private long articleId;
    private long tagId;
    public long getArticleId() {
        return articleId;
    }
    public void setArticleId(long articleId) {
        this.articleId = articleId;
    }
    public long getAuthorId() {
        return tagId;
    }
    public void setAuthorId(long authorId) {
        this.tagId = authorId;
    }

    
}
