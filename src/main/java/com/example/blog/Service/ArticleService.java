package com.example.blog.Service;

import com.example.blog.Model.ArticleVo;
import com.example.blog.Repository.ArticleRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ArticleService {

    @Autowired
    private ArticleRepository articleRepository;
    //取得全部文章 可用於文章列表//先讓Controller跳過Service直接和Repo對接
    // public Page getAllArticles(Page pageable) {
    //     return articleRepository.findAll(pageable);
    // }

    //透過ID查詢文章
    public Optional<ArticleVo> getArticleById(Long articleId) {

        return articleRepository.findByIdWithComments(articleId);

        // return articleRepository.findById(articleId);

    }

    public List<ArticleVo> searchArticleByTitle(String title) {
        return articleRepository.findByTitleContaining(title);
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
