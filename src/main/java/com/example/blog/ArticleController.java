package com.example.blog;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:3000") // 設定允許的來源網站，這裡是本地的 React 應用
@RestController
@RequestMapping("/api/articles") // 設定基本路徑
public class ArticleController {
    @Autowired
    private ArticleService articleService; // 注入 ArticleService 服務

    @GetMapping
    public List<Article> getAllArticles() {
        // 獲取所有文章
        return articleService.getAllArticles();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Article> getArticleById(@PathVariable Long id) {
        // 根據 ID 獲取單一文章
        return articleService.getArticleById(id)
                .map(article -> ResponseEntity.ok(article)) // 如果找到文章，返回 200 狀態碼和文章內容
                .orElse(ResponseEntity.notFound().build()); // 如果未找到文章，返回 404 狀態碼
    }

    @PostMapping
    public Article createArticle(@RequestBody Article article) {
        // 創建新文章
        return articleService.saveArticle(article);
    }
}
