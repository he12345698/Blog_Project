package com.example.blog.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.blog.Model.Articles2;

// ArticleRepository 介面繼承自 JpaRepository，用於執行 Article 實體的數據存取操作
@Repository
public interface OneArticleRepository extends JpaRepository <Articles2, Long> {

    Articles2 findById(long l);
    // 不需要額外定義方法，JpaRepository 已經提供了基本的 CRUD 操作方法
    
}

