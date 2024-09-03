package com.example.blog.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.blog.Model.TagArticleVo;
import com.example.blog.Model.TagVo;
import com.example.blog.Repository.TagArticleRepository;
import com.example.blog.Repository.TagRepository;

@Service
public class TagService {
    @Autowired
    TagRepository tagRepository;

    public List<TagVo> getAllTags(){
        return tagRepository.findAll();
    }

    public TagVo getTagById(Long id) {
        return tagRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Service: Tag not found \nwith id="+id));
    }
}
