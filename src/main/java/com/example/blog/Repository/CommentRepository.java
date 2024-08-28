package com.example.blog.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.blog.Model.CommentVo;

@Repository
public interface CommentRepository extends JpaRepository<CommentVo, Long> {
    // 根據 ArticleVo 的 article_id 查詢所有評論
    List<CommentVo> findByArticleArticleId(Long articleId);
}




import org.springframework.data.jpa.repository.JpaRepository;

import com.example.blog.Model.Comment;

import java.util.List;

// CommentRepository 介面繼承自 JpaRepository，用於執行 Comment 實體的數據存取操作
public interface CommentRepository extends JpaRepository<Comment, Long> {

    // 根據文章 ID 查詢評論列表
    List<Comment> findByArticleId(Long articleId);
}

