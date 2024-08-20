package com.example.blog.controller;

import com.example.blog.Vo.ArticleVo;
import com.example.blog.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/articles")
public class ArticleController {

    @Autowired
    private ArticleService articleService;

    @GetMapping
    public List<ArticleVo> getAllArticles() {
        return articleService.getAllArticles();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArticleVo> getArticleById(@PathVariable Long id) {
        return articleService.getArticleById(id)
                .map(article -> ResponseEntity.ok(article))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ArticleVo createArticle(@RequestBody ArticleVo article) {
        return articleService.createOrUpdateArticle(article);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ArticleVo> updateArticle(@PathVariable Long id, @RequestBody ArticleVo article) {
        return articleService.getArticleById(id)
                .map(existingArticle -> {
                    existingArticle.setTitle(article.getTitle());
                    existingArticle.setCategory(article.getCategory());
                    existingArticle.setContent(article.getContent());
                    ArticleVo updatedArticle = articleService.createOrUpdateArticle(existingArticle);
                    return ResponseEntity.ok(updatedArticle);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArticle(@PathVariable Long id) {
        return articleService.getArticleById(id)
                .map(article -> {
                    articleService.deleteArticle(id);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
