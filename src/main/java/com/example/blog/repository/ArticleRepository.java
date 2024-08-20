package com.example.blog.repository;

import com.example.blog.Vo.ArticleVo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArticleRepository extends JpaRepository<ArticleVo, Long> {
    // 你可以在這裡定義一些自定義查詢方法，比如通過標題查詢文章
}
