package com.example.blog.service;

import com.example.blog.Model.ArticleVo;
import com.example.blog.repository.ArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ArticleService {

    @Autowired
    private ArticleRepository articleRepository;
    //取得全部文章 可用於文章列表
    public List<ArticleVo> getAllArticles() {
        return articleRepository.findAll();
    }
    //透過ID查詢文章

    public Optional<ArticleVo> getArticleById(Long article_id) {
        return articleRepository.findById(article_id);
    }

    public List<ArticleVo> searchArticleByTitle(String title) {
        return articleRepository.findByTitleContaining(title);
    }
    //新增或更新文章 根據JpaRepository的方法 它會自動偵測ID是否存在 不存在則新增 存在則更新
    public ArticleVo createOrUpdateArticle(ArticleVo article) {
        return articleRepository.save(article);
    }
    //根據ID刪除文章

    public void deleteArticle(Long article_id) {
        articleRepository.deleteById(article_id);
    }
}
