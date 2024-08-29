package com.example.blog.Service;

import com.example.blog.Model.ArticleVo;
import com.example.blog.Repository.ArticleRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class ArticleService {

    @Autowired
    private ArticleRepository articleRepository;
    
    public Page<ArticleVo> searchArticles(String keyword, String authorKeyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        if (keyword != null && !keyword.isEmpty()) {
            return articleRepository.findByTitleContaining(keyword, pageable);
        }
        if (authorKeyword != null && !authorKeyword.isEmpty()) {
            return articleRepository.findByAuthorUsernameContaining(authorKeyword, pageable);
        }
        return articleRepository.findAll(pageable);
    }
    

    //透過ID查詢文章
    public Optional<ArticleVo> getArticleById(Long articleId) {

        return articleRepository.findByIdWithComments(articleId);

        // return articleRepository.findById(articleId);

    }

    //新增或更新文章 根據JpaRepository的方法 它會自動偵測ID是否存在 不存在則新增 存在則更新
    public ArticleVo createOrUpdateArticle(ArticleVo article) {
        return articleRepository.save(article);
    }
    //根據ID刪除文章

    public void deleteArticle(Long articleId) {
        articleRepository.deleteById(articleId);
    }

    
}
