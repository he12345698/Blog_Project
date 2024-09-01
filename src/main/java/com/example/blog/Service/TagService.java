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
    
    @Autowired
    private TagArticleRepository tagArticleVoRepository;
    // public Optional<TagVo> getArticleTag(Long articleId) {
    //     return tagRepository.findByArticleId(articleId);
    // }

    public List<TagVo> getAllTags(){
        return tagRepository.findAll();
    }

    public List<TagVo> findTagsByArticleId(Long articleId) {
        // 查找所有與 articleId 關聯的 TagArticleVo 條目
        List<TagArticleVo> tagArticleVos = tagArticleVoRepository.findByArticle_Id(articleId);

        // 提取 Tags
        return tagArticleVos.stream()
                .map(TagArticleVo::getTag)
                .collect(Collectors.toList());
    }
}
