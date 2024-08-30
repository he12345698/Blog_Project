package com.example.blog.Repository;

import com.example.blog.Model.TagArticleVo;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TagArticleRepository extends JpaRepository<TagArticleVo, Long> {
    List<TagArticleVo> findByArticle_Id(Long articleId);
}
