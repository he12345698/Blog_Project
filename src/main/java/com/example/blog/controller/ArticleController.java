package com.example.blog.controller;

import com.example.blog.Model.ArticleVo;
import com.example.blog.repository.ArticleRepository;
import com.example.blog.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/articles")
public class ArticleController {
    
    @Autowired
    private ArticleService articleService;
    @Autowired
    private ArticleRepository articleRepository;

    //直接用get方法 取得全部文章的列表
    @GetMapping
    public Page<ArticleVo> getArticleVo(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy) {
        
        // 使用 Sort 進行排序
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
        return articleRepository.findAll(pageable);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ArticleVo> getArticleById(@PathVariable Long id) {
        return articleService.getArticleById(id)
                .map(article -> ResponseEntity.ok(article))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public List<ArticleVo> getArticleByTitle(@PathVariable String title) {
        return articleService.searchArticleByTitle(title);
    }

    @PostMapping
    public ArticleVo createArticle(@RequestBody ArticleVo article) {
        return articleService.createOrUpdateArticle(article);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ArticleVo> updateArticle(@PathVariable Long article_id, @RequestBody ArticleVo article) {
        return articleService.getArticleById(article_id)
                .map(existingArticle -> {
                    existingArticle.setAuthor_id(article.getAuthor_id());
                    existingArticle.setTitle(article.getTitle());
                    existingArticle.setContentTEXT(article.getContentTEXT());
                    existingArticle.setPublished_at(article.getPublished_at());
                    existingArticle.setLast_edited_at(article.getLast_edited_at());
                    ArticleVo updatedArticle = articleService.createOrUpdateArticle(existingArticle);
                    return ResponseEntity.ok(updatedArticle);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArticle(@PathVariable Long article_id) {
        return articleService.getArticleById(article_id)
                .map(article -> {
                    articleService.deleteArticle(article_id);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
