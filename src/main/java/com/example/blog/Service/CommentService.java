package com.example.blog.Service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.blog.Model.CommentVo;
import com.example.blog.Repository.CommentRepository;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    // 根據 ID 獲取單一評論
    public CommentVo getCommentById(Long id) {
        return commentRepository.findById(id).orElse(null);
    }

    // 保存評論
    public CommentVo saveComment(CommentVo comment) {
        return commentRepository.save(comment);
    }

    // 根據文章 ID 獲取所有評論
    public List<CommentVo> getCommentsByArticleId(Long articleId) {
        return commentRepository.findByArticleArticleId(articleId);
    }

import com.example.blog.Model.Comment;
import com.example.blog.Repository.CommentRepository;

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
