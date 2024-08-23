package com.example.blog;

import java.util.Optional; // 引入 Optional 類別，用於處理可能為空的值
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service // 標註此類別為 Spring 的服務層組件
public class ArticleService {
    
    @Autowired
    private ArticleRepository articleRepository; // 注入 ArticleRepository，用於數據操作

    // 獲取所有文章
    public List<Article> getAllArticles() {
        return articleRepository.findAll();
    }

    // 根據 ID 獲取文章
    public Optional<Article> getArticleById(Long id) {
        return articleRepository.findById(id);
    }

    // 保存文章
    public Article saveArticle(Article article) {
        return articleRepository.save(article);
    }
}
