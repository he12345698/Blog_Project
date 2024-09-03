package com.example.blog.Repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.blog.Model.ArticleLike;

import java.util.Optional;

@Repository
public interface ArticleLikeRepository extends JpaRepository<ArticleLike, Long> {
    
    // 檢查是否存在使用者對文章的按讚記錄
    boolean existsByArticleIdAndUserId(Long articleId, Long userId);

    
    // 刪除使用者對文章的按讚記錄
    void deleteByArticleIdAndUserId(Long articleId, Long userId);

    // 查詢使用者對某篇文章的按讚記錄
    Optional<ArticleLike> findByArticleIdAndUserId(Long articleId, Long userId);
}

