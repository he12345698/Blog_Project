package com.example.blog.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import com.example.blog.Repository.ArticleSearchViewRepository;
import com.example.blog.Model.ArticleSearchView;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Service
public class ArticleSearchService {

    @Autowired
    private ArticleSearchViewRepository repository;


    // public List<ArticleSearchView> searchArticles(String keyword) {
    //     return repository.searchArticles(keyword);
    // }

    // 分頁查詢
    public Page<ArticleSearchView> searchArticles(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return repository.findByTitleContainingIgnoreCaseOrUsernameContainingIgnoreCase(keyword, keyword, pageable);
    }

    // 獲取所有文章（這裡也可以添加分頁）
    public Page<ArticleSearchView> findAllArticles(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return repository.findAll(pageable);
    }
    
    // 根據標籤 ID 查詢文章
    public Page<ArticleSearchView> findByTagId(Long tagId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return repository.findByTagId(tagId, pageable);
    }
}
