package com.example.blog.Controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.hibernate.annotations.Comment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.blog.JwtUtil;
import com.example.blog.Model.AccountVo;
import com.example.blog.Model.ArticleVo;
import com.example.blog.Model.CommentVo;
import com.example.blog.Repository.CommentRepository;
import com.example.blog.Service.AccountService;
import com.example.blog.Service.ArticleService;
import com.example.blog.Service.CommentService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private AccountService accountService;

    @Autowired
    private ArticleService articleService;

    @Autowired
    private CommentRepository commentRepository;

    // 創建新留言
    @PostMapping
    public ResponseEntity<CommentVo> createComment(
            @RequestParam Long articleId, // 從請求參數中取得 articleId
            @RequestBody CommentVo commentVo,
            HttpServletRequest request) {
        // 從 header 中提取 token 並驗證
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = authorizationHeader.substring(7); // 移除 Bearer 前綴
        Long userId = JwtUtil.extractId(token);

        // 驗證使用者存在
        AccountVo author = accountService.findById(userId)
                .orElseThrow(() -> new RuntimeException("使用者不存在"));

        // 設置作者和文章
        commentVo.setAuthor(author);
        Optional<ArticleVo> article = articleService.findById(articleId);
        article.ifPresent(commentVo::setArticle); // 只有在文章存在時才設置

        commentVo.setCreatedAt(LocalDateTime.now());

        CommentVo savedComment = commentService.saveComment(articleId, commentVo);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedComment);
    }

    // 根據文章 ID 獲取所有留言
    @GetMapping("/article/{articleId}")
    public ResponseEntity<List<CommentVo>> getCommentsByArticleId(@PathVariable Long articleId) {
        List<CommentVo> comments = commentService.getCommentsByArticleId(articleId);

        // 處理作者為 null 的情況，防止前端報錯
        comments.forEach(comment -> {
            if (comment.getAuthor() == null) {
                AccountVo anonymous = new AccountVo();
                anonymous.setUsername("匿名");
                comment.setAuthor(anonymous);
            }
        });

        return ResponseEntity.ok(comments);
    }

    // 切換留言按讚狀態
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

        return ResponseEntity.ok().build(); // 返回成功的狀態
    }

    // 檢查留言是否已按讚
    @GetMapping("/{commentId}/isLiked")
    public ResponseEntity<Map<String, Boolean>> isCommentLiked(
            @PathVariable Long commentId,
            HttpServletRequest request) {
        // 從請求中提取 JWT token 並驗證
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // 未授權
        }

        String token = authorizationHeader.substring(7); // 去掉 "Bearer " 前綴

        if (JwtUtil.isTokenExpired(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // Token 已過期
        }

        Long userId = JwtUtil.extractId(token);

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // Token 無效
        }

        // 使用 service 檢查是否已按讚
        boolean isLiked = commentService.isCommentLiked(commentId, userId);
        System.out.println(commentId + " isLiked is " + isLiked);
        Map<String, Boolean> response = new HashMap<>();
        response.put("liked", isLiked);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CommentVo> updateComment(@PathVariable Long id, @RequestBody CommentVo commentData) {
        Optional<CommentVo> commentOptional = commentRepository.findById(id);
        if (commentOptional.isPresent()) {
            CommentVo comment = commentOptional.get();
            System.out.println("\n\n\n\n\nisPresent");
            // 檢查當前用戶是否是留言的作者
            System.out.println(comment.getAuthor().isPresent());

            System.out.println("\n\n\n\n\nhaveAuthor");
            comment.setContent(commentData.getContent());
            commentRepository.save(comment);
            return ResponseEntity.ok(comment);
        } else {
            return ResponseEntity.notFound().build(); // 如果找不到留言，返回 404
        }
    }

}
