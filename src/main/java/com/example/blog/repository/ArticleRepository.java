package com.example.blog.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.blog.Model.ArticleVo;

@Repository
public interface ArticleRepository extends JpaRepository<ArticleVo, Long> {
    // 你可以在這裡定義一些自定義查詢方法，比如通過標題查詢文章
}
