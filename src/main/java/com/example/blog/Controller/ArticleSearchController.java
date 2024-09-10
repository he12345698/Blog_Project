package com.example.blog.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.blog.Model.ArticleSearchView;
import com.example.blog.Service.ArticleSearchService;

@RestController
public class ArticleSearchController {

    @Autowired
    private ArticleSearchService service;

    // 獲取所有文章，支持分頁
    @GetMapping("/articles")
    public Page<ArticleSearchView> getAllArticles(@RequestParam(defaultValue = "0") int page,
                                                   @RequestParam(defaultValue = "10") int size) {
        return service.findAllArticles(page, size);
    }

    // 搜索文章，支持分頁
    @GetMapping("/search")
    public Page<ArticleSearchView> searchArticles(@RequestParam String keyword,
                                                  @RequestParam(defaultValue = "0") int page,
                                                  @RequestParam(defaultValue = "10") int size) {
        return service.searchArticles(keyword, page, size);
    }
    // 根據標籤 ID 查詢文章，支持分頁
    @GetMapping("/articlesByTag")
    public Page<ArticleSearchView> getArticlesByTag(@RequestParam Long tagId,
                                                    @RequestParam(defaultValue = "0") int page,
                                                    @RequestParam(defaultValue = "10") int size) {
        return service.findByTagId(tagId, page, size);
    }
}