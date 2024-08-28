package com.example.blog.Model;

public class Article2Vo {
    Long article_id;

    // 文章標題
    String title;

    // 文章內容
    String contentTEXT;

    // 文章作者
    String author_id;

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
}
