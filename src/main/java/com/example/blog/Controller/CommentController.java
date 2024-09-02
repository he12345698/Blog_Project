package com.example.blog.Controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

import com.example.blog.JwtUtil;
import com.example.blog.Model.ArticleVo;
import com.example.blog.Model.CommentVo;
import com.example.blog.Repository.ArticleRepository;
import com.example.blog.Service.CommentService;

import jakarta.servlet.http.HttpServletRequest;


@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "http://localhost:3000") // 或者你的前端地址
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


    @PostMapping("/{commentId}/like")
public ResponseEntity<Void> toggleCommentLike(@PathVariable Long commentId, HttpServletRequest request) {
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
    boolean hasLiked = commentService.toggleCommentLike(commentId, userId);

    if (hasLiked) {
        return ResponseEntity.ok().build(); // 成功按讚或收回讚後返回200
    } else {
        return ResponseEntity.ok().build(); // 這裡應該也返回200，表示操作成功
    }
}
@GetMapping("/{commentId}/isLiked")
public ResponseEntity<Map<String, Boolean>> isCommentLiked(
        @PathVariable Long commentId,
        HttpServletRequest request) {
System.out.println("start autho");
    // 從請求中提取 JWT token 並驗證
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

    // 使用 service 檢查是否已按讚
    boolean isLiked = commentService.isCommentLiked(commentId, userId);
    Map<String, Boolean> response = new HashMap<>();
    response.put("liked", isLiked);

    return ResponseEntity.ok(response);
}
}
