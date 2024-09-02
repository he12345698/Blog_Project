package com.example.blog.Controller;

import com.example.blog.Model.ArticleVo;
import com.example.blog.Model.TagVo;
import com.example.blog.Repository.ArticleRepository;
import com.example.blog.Service.ArticleService;
import java.lang.String;

import com.example.blog.Service.TagService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
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

    @GetMapping
    public ResponseEntity<List<ArticleVo>> searchArticles(@RequestParam("query") String query) {
        List<ArticleVo> articles = articleService.searchByTitleOrAuthor(query);
        return new ResponseEntity<>(articles, HttpStatus.OK);
    }

    // 直接用get方法 取得全部文章的列表
    @GetMapping("/list")
    public Page<ArticleVo> getArticleVo(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "articleId") String sortBy) {

        // 使用 Sort 進行排序
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
        return articleRepository.findAll(pageable);
    }

    @GetMapping("/{articleId}")
    public ResponseEntity<ArticleVo> getArticleById(@PathVariable Long articleId) {
        return articleService.getArticleById(articleId)
                .map(article -> ResponseEntity.ok(article))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ArticleVo createArticle(@RequestBody ArticleVo article, @RequestParam Long tagId) {
        return articleService.createOrUpdateArticle(article, tagId);
    }

    @PutMapping("/{articleId}")
    public ResponseEntity<ArticleVo> updateArticle(@PathVariable Long articleId, @RequestBody ArticleVo article, @RequestParam Long tagId) {
        return articleService.getArticleById(articleId)
                .map(existingArticle -> {
                    existingArticle.setAuthorId(article.getAuthorId());
                    existingArticle.setTitle(article.getTitle());
                    existingArticle.setContentTEXT(article.getContentTEXT());
                    existingArticle.setPublishedAt(article.getPublishedAt());
                    existingArticle.setLastEditedAt(article.getLastEditedAt());
                    System.out.println(tagId);
                    ArticleVo updatedArticle = articleService.createOrUpdateArticle(existingArticle, tagId);
                    return ResponseEntity.ok(updatedArticle);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{articleId}")
    public ResponseEntity<Void> deleteArticle(@PathVariable Long articleId) {
        return articleService.getArticleById(articleId)
                .map(article -> {
                    articleService.deleteArticle(articleId);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{articleId}/tag")
    public ResponseEntity<Long> getTagIdByArticleId(@PathVariable Long articleId) {
        Long tagId = articleService.getTagIdByArticleId(articleId);
        if (tagId != null) {
            return ResponseEntity.ok(tagId);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
