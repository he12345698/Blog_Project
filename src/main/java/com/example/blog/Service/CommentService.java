package com.example.blog.Service;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.blog.Model.ArticleVo;
import com.example.blog.Model.CommentVo;
import com.example.blog.Repository.ArticleRepository;
import com.example.blog.Repository.CommentRepository;


@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private ArticleRepository articleRepository;

    public CommentVo saveComment(Long articleId, CommentVo comment) {
        ArticleVo article = articleRepository.findById(articleId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid article ID"));

        comment.setArticle(article); 
        comment.setCreatedAt(LocalDateTime.now());
        commentRepository.save(comment);

        return commentRepository.save(comment);
    }

    public List<CommentVo> getCommentsByArticleId(Long articleId) {
        return commentRepository.findByArticleArticleId(articleId);
    }
}


