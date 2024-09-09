package com.example.blog.Service;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.blog.Model.AccountVo;
import com.example.blog.Model.ArticleVo;
import com.example.blog.Model.CommentLike;
import com.example.blog.Model.CommentVo;
import com.example.blog.Repository.AccountRepository;
import com.example.blog.Repository.ArticleRepository;
import com.example.blog.Repository.CommentLikeRepository;
import com.example.blog.Repository.CommentRepository;


@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private CommentLikeRepository commentLikeRepository;

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
        List<CommentVo> comments = commentRepository.findByArticleArticleId(articleId);
        System.out.println("Fetched comments: " + comments.size());
        return comments;
    }
    
    @Transactional
    public boolean toggleCommentLike(Long commentId, Long userId) {
        CommentLike commentLike = commentLikeRepository.findByCommentIdAndUserId(commentId, userId)
            .orElse(new CommentLike());
        
        if (commentLike.getId() == null) {
            // 新增點讚記錄
            commentLike.setCommentId(commentId);
            commentLike.setUserId(userId);
            commentLike.setLiked(true);
            commentLikeRepository.save(commentLike);
        } else {
            // 切換點讚狀態
            commentLike.setLiked(!commentLike.isLiked());
            commentLikeRepository.save(commentLike);
        }

        // 根據點讚狀態更新評論的點讚數量
        CommentVo comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        if (commentLike.isLiked()) {
            comment.setLikes(comment.getLikes() + 1);
        } else {
            comment.setLikes(comment.getLikes() - 1);
        }
        commentRepository.save(comment);
        return false;
    }

    public boolean isCommentLiked(Long commentId, Long userId) {
        // 使用 commentId 和 userId 從資料庫中檢查是否有對應的按讚紀錄
        return commentLikeRepository.existsByCommentIdAndUserIdAndLikedTrue(commentId, userId);
    }

    


    


  
    
}


