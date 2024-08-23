package com.example.blog;

import org.springframework.data.jpa.repository.JpaRepository;

// ArticleRepository 介面繼承自 JpaRepository，用於執行 Article 實體的數據存取操作
public interface ArticleRepository extends JpaRepository<Article, Long> {
    // 不需要額外定義方法，JpaRepository 已經提供了基本的 CRUD 操作方法
}

