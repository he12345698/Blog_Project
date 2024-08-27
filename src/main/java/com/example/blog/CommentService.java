package com.example.blog;

import java.util.List;

import org.apache.el.stream.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service // 標註此類別為 Spring 的服務層組件
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    
    public Comment getCommentById(Long id){
        return commentRepository.findById(id).orElse(null);
    }
    

    // 保存新評論到數據庫
    public Comment saveComment(Comment comment) {
        return commentRepository.save(comment);
    }
}
