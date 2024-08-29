package com.example.blog.Repository;

import com.example.blog.Model.TagArticleVo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TagArticleRepository extends JpaRepository<TagArticleVo, Long> {
}
