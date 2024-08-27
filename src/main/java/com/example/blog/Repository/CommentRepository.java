package com.example.blog.Repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.example.blog.Model.Comment;

import java.util.List;

// CommentRepository 介面繼承自 JpaRepository，用於執行 Comment 實體的數據存取操作
public interface CommentRepository extends JpaRepository<Comment, Long> {

    // 根據文章 ID 查詢評論列表
    List<Comment> findByArticleId(Long articleId);
}
