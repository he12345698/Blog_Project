package com.example.blog;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.blog.Comment;
import java.util.List;
import java.util.Optional;

@Repository
// CommentRepository 介面繼承自 JpaRepository，用於執行 Comment 實體的數據存取操作
public interface CommentRepository extends JpaRepository<Comment, Long> {

    // 根據文章 ID 查詢評論列表
    Optional<Comment> findById(Long id);
}
