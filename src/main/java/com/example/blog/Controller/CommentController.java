package com.example.blog.Controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import com.example.blog.Model.CommentVo;
import com.example.blog.Service.CommentService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    // 根據文章 ID 查詢所有評論
    @GetMapping("/article/{articleId}")
    public ResponseEntity<List<CommentVo>> getCommentsByArticleId(@PathVariable(value = "articleId") Long articleId) {
        List<CommentVo> comments = commentService.getCommentsByArticleId(articleId);
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommentVo> getCommentsById(@PathVariable(value = "id") Long id) {
        CommentVo comment = commentService.getCommentById(id);
        if (comment != null) {
            return ResponseEntity.ok(comment);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping
    public CommentVo createComment(@RequestBody CommentVo comment) {

import com.example.blog.Model.Comment;
import com.example.blog.Service.CommentService;

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
