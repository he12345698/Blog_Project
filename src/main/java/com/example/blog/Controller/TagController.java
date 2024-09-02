package com.example.blog.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.blog.Model.TagVo;
import com.example.blog.Service.TagService;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/tags")
public class TagController {
    @Autowired
    private TagService tagService;


    // @GetMapping("/{articleId}")
    // public ResponseEntity<TagVo> getArticleTag(@PathVariable Long articleId) {
    //     return tagService.getArticleTag(articleId)
    //             .map(tag -> ResponseEntity.ok(tag))
    //             .orElseGet(() -> ResponseEntity.notFound().build());
    // }

    @GetMapping("/all")
    public List<TagVo> getAllTags(){
        return tagService.getAllTags();
    }

    @GetMapping("/{id}")
    public TagVo getTagById(@PathVariable Long id) {
        return tagService.getTagById(id);
    }
}
