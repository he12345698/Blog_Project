package com.example.blog;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service // 標註此類別為 Spring 的服務層組件
public class CommentService {

    @Autowired
    private CommentRepository commentRepository; // 注入 CommentRepository，用於數據操作

    // 根據文章 ID 獲取所有相關評論
    public List<Comment> getCommentsByArticleId(Long articleId) {
        return commentRepository.findByArticleId(articleId);
    }

    // 保存新評論到數據庫
    public Comment saveComment(Comment comment) {
        return commentRepository.save(comment);
    }
}
