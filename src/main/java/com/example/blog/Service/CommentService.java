
package com.example.blog.Service;


import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.blog.Model.CommentVo;
import com.example.blog.Repository.CommentRepository;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    // 根據 ID 獲取單一評論
    public CommentVo getCommentById(Long id) {
        return commentRepository.findById(id).orElse(null);
    }

    // 保存評論
    public CommentVo saveComment(CommentVo comment) {
        return commentRepository.save(comment);
    }

    // 根據文章 ID 獲取所有評論
    public List<CommentVo> getCommentsByArticleId(Long articleId) {
        return commentRepository.findByArticleArticleId(articleId);
    }
}


