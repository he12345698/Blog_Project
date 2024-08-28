
package com.example.blog.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.blog.Model.CommentVo;

@Repository
public interface CommentRepository extends JpaRepository<CommentVo, Long> {
    // 根據 ArticleVo 的 article_id 查詢所有評論
    List<CommentVo> findByArticleArticleId(Long articleId);
}


