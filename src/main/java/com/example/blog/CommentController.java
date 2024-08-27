package com.example.blog;

import java.util.List;

import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
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

    @GetMapping("/{id}")
    public ResponseEntity<Comment> getCommentsById(@PathVariable(value="id") Long id) {
        Comment comment =commentService.getCommentById(id);
        if (comment!=null) {
    return  ResponseEntity.ok(comment);          
        }else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping
    public Comment createComment(@RequestBody Comment comment) {
        // 創建新評論
        return commentService.saveComment(comment);
    }
}
