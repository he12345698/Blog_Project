package com.example.blog.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.blog.Model.TagVo;
@Repository
public interface TagRepository extends JpaRepository<TagVo, Long>{
    // Optional<TagVo> findByArticleId(Long articleId);
}
