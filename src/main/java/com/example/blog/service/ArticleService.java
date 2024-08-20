package com.example.blog.service;

import com.example.blog.Vo.ArticleVo;
import com.example.blog.repository.ArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ArticleService {

    @Autowired
    private ArticleRepository articleRepository;

    public List<ArticleVo> getAllArticles() {
        return articleRepository.findAll();
    }

    public Optional<ArticleVo> getArticleById(Long id) {
        return articleRepository.findById(id);
    }

    public ArticleVo createOrUpdateArticle(ArticleVo article) {
        return articleRepository.save(article);
    }

    public void deleteArticle(Long id) {
        articleRepository.deleteById(id);
    }
}
