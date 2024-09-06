package com.example.blog.Repository;

import java.util.List;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import com.example.blog.Model.ArticleSearchView;
import com.example.blog.Model.ArticleVo;

@Repository
public interface ArticleRepository extends JpaRepository<ArticleVo, Long> {
    // 你可以在這裡定義一些自定義查詢方法，比如通過標題查詢文章

    // Spring Data JPA 使用方法名稱來推斷查詢邏輯。只要你新增的方法名稱不與預設方法重名，這些方法就能獨立運作，互不干涉。

  
    // @EntityGraph(attributePaths = {"comments"})
    //Optional<ArticleVo> findByArticleId(Long articleId);
    @EntityGraph(attributePaths = { "comments" })
    @Query("SELECT DISTINCT a FROM ArticleVo a LEFT JOIN FETCH a.comments WHERE a.articleId = :articleId")
    Optional<ArticleVo> findByIdWithComments(@Param("articleId") Long articleId);
    

    @Query("SELECT a FROM ArticleVo a JOIN AccountVo u ON a.authorId = u.id " +
           "WHERE a.title LIKE %:keyword% OR u.username LIKE %:keyword%")
    List<ArticleVo> searchByTitleOrAuthor(@Param("keyword") String keyword);
    
    List<ArticleVo> findByTitleContainingIgnoreCase(String title);
    
    List<ArticleVo> findByAuthorId(Long authorId);

    @Query("SELECT a.tag.tag_id FROM ArticleVo a WHERE a.articleId = :articleId")
    Long findTagIdByArticleId(@Param("articleId") Long articleId);
}
