package com.example.blog.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.blog.Model.ArticleSearchView;

import java.util.List;

@Repository
public interface ArticleSearchViewRepository extends JpaRepository<ArticleSearchView, Long> {
   
    @Query("SELECT a FROM ArticleSearchView a WHERE LOWER(a.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(a.username) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<ArticleSearchView> searchArticles(@Param("keyword") String keyword);

    Page<ArticleSearchView> findByTitleContainingIgnoreCaseOrUsernameContainingIgnoreCase(String titleKeyword, String usernameKeyword, Pageable pageable);


    // 添加根據標籤 ID 查詢的方法
    @Query("SELECT a FROM ArticleSearchView a WHERE a.tag_id = :tagId")
    Page<ArticleSearchView> findByTagId(@Param("tagId") Long tagId, Pageable pageable);
}