package com.example.blog.Controller;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.blog.Model.ArticleVo;
import com.example.blog.Model.CommentVo;
import com.example.blog.Repository.ArticleRepository;
import com.example.blog.Service.CommentService;


@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping
public ResponseEntity<CommentVo> createComment(@RequestParam Long articleId, @RequestBody CommentVo comment) {
    CommentVo savedComment = commentService.saveComment(articleId, comment);
    return ResponseEntity.status(HttpStatus.CREATED).body(savedComment);
}

    // 根據文章 ID 獲取所有評論
    @GetMapping("/article/{articleId}")
    public ResponseEntity<List<CommentVo>> getCommentsByArticleId(@PathVariable Long articleId) {
        List<CommentVo> comments = commentService.getCommentsByArticleId(articleId);
        return ResponseEntity.ok(comments);
    }
}
