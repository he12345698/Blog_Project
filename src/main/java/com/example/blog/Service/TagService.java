package com.example.blog.Service;

import java.util.Optional;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.blog.Model.TagVo;
import com.example.blog.Repository.TagRepository;

@Service
public class TagService {
    @Autowired
    TagRepository tagRepository;

    public Optional<TagVo> getArticleTag(Long articleId) {
        return tagRepository.findByArticleId(articleId);
    }

    public List<TagVo> getAllTags(){
        return tagRepository.findAll();
    }
}
