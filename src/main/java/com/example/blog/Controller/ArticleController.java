package com.example.blog.Controller;

import com.example.blog.JwtUtil;
import com.example.blog.Model.ArticleVo;
import com.example.blog.Model.TagVo;
import com.example.blog.Repository.ArticleRepository;
import com.example.blog.Service.ArticleService;

import jakarta.servlet.http.HttpServletRequest;

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

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/articles")
public class ArticleController {

    @Autowired
    private ArticleService articleService;
    @Autowired
    private ArticleRepository articleRepository;

    @GetMapping("/search")
    public ResponseEntity<List<ArticleVo>> searchArticles(@RequestParam("query") String query) {
        List<ArticleVo> articles = articleService.searchByTitleOrAuthor(query);
        return new ResponseEntity<>(articles, HttpStatus.OK);
    }

    // 直接用get方法 取得全部文章的列表
    @GetMapping
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

    @PostMapping("/{articleId}/like")
    public ResponseEntity<Void> toggleArticleLike(@PathVariable Long articleId, HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            System.out.print("未授權");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // 未授權
        }

        String token = authorizationHeader.substring(7); // 去掉 "Bearer " 前綴

        if (JwtUtil.isTokenExpired(token)) {
            System.out.print("Token 已過期");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // Token 已過期
        }

        Long userId = JwtUtil.extractId(token);

        if (userId == null) {
            System.out.print("Token 無效");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // Token 無效
        }
        System.out.print("認證通過");
        // 使用 userId 進行按讚或收回讚操作
        boolean hasLiked = articleService.toggleArticleLike(articleId, userId);

        if (hasLiked) {
            return ResponseEntity.ok().build(); // 成功按讚或收回讚後返回200
        } else {
            
            return ResponseEntity.ok().build(); // 這裡應該也返回200，表示操作成功
        }
    }
    @GetMapping("/{articleId}/isLiked")
    public ResponseEntity<Map<String, Boolean>> isArticleLiked(
            @PathVariable Long articleId,
            HttpServletRequest request) {
        
        // 從請求中提取 JWT token 並驗證
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // 未授權
        }

        String token = authorizationHeader.substring(7); // 去掉 "Bearer " 前綴
        Long userId = JwtUtil.extractId(token);

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // Token 無效
        }

        // 使用 service 檢查是否已按讚
        boolean isLiked = articleService.isArticleLiked(articleId, userId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("liked", isLiked);

        return ResponseEntity.ok(response);
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

    // 獲取特定用戶的文章
    @GetMapping("author/{authorId}")
    public ResponseEntity<List<ArticleVo>> getArticlesByAuthorId(@PathVariable Long authorId) {
        List<ArticleVo> articles = articleService.getArticleByAuthorId(authorId);
        System.out.println(authorId);
        if (articles.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(articles);
    }
    
}
