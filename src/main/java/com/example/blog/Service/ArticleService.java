package com.example.blog.Service;

import com.example.blog.Model.AccountVo;
import com.example.blog.Model.ArticleVo;
import com.example.blog.Repository.AccountRepository;
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

        @Autowired
    private AccountRepository accountRepository;
    
    public List<ArticleVo> searchByTitleOrAuthor(String keyword) {
        List<ArticleVo> articlesByTitle = articleRepository.findByTitleContainingIgnoreCase(keyword);
        List<AccountVo> authors = accountRepository.findByUsernameContainingIgnoreCase(keyword);
        
        Set<ArticleVo> combinedResults = new HashSet<>(articlesByTitle);
        
        for (AccountVo author : authors) {
            combinedResults.addAll(articleRepository.findByAuthorId(author.getId()));
        }

        return new ArrayList<>(combinedResults);
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

    // 根據用戶id 獲取特定用戶文章
    public List<ArticleVo> getArticleByAuthorId(Long authorId) {
        return articleRepository.findByAuthorId(authorId);
    }

    
}
