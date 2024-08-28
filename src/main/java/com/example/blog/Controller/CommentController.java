package com.example.blog;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:3000") // 設定允許的來源網站，這裡是本地的 React 應用
@RestController
@RequestMapping("/api/comments") // 設定基本路徑
public class CommentController {
    @Autowired
    private CommentService commentService; // 注入 CommentService 服務

    @GetMapping("/{articleId}")
    public List<Comment> getCommentsByArticleId(@PathVariable Long articleId) {
        // 根據文章 ID 獲取所有相關評論
        return commentService.getCommentsByArticleId(articleId);
    }

    @PostMapping
    public Comment createComment(@RequestBody Comment comment) {
        // 創建新評論
        return commentService.saveComment(comment);
    }
}
