package com.example.blog.Service;

import com.example.blog.Model.ArticleLike;
import com.example.blog.Repository.ArticleLikeRepository;
import com.example.blog.Model.AccountVo;
import com.example.blog.Model.ArticleVo;
import com.example.blog.Model.TagVo;
import com.example.blog.Repository.AccountRepository;
import com.example.blog.Repository.ArticleRepository;
import com.example.blog.Repository.TagRepository;

import ch.qos.logback.classic.Logger;

import org.hibernate.mapping.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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


    @Autowired
    private ArticleLikeRepository articleLikeRepository;

    @Autowired
    private TagRepository tagRepository;

    public List<ArticleVo> searchByTitleOrAuthor(String keyword) {
        List<ArticleVo> articlesByTitle = articleRepository.findByTitleContainingIgnoreCase(keyword);
        List<AccountVo> authors = accountRepository.findByUsernameContainingIgnoreCase(keyword);

        Set<ArticleVo> combinedResults = new HashSet<>(articlesByTitle);

        for (AccountVo author : authors) {
            combinedResults.addAll(articleRepository.findByAuthorId(author.getId()));
        }

        return new ArrayList<>(combinedResults);
    }

    // 透過ID查詢文章
    public Optional<ArticleVo> getArticleById(Long articleId) {

        return articleRepository.findByIdWithComments(articleId);

    }
    @Transactional
    public boolean toggleArticleLike(Long articleId, Long userId) {
        try {
            boolean hasLiked = articleLikeRepository.existsByArticleIdAndUserId(articleId, userId);
    
            if (hasLiked) {
                System.out.println("使用者已按讚，準備刪除按讚記錄");
                articleLikeRepository.deleteByArticleIdAndUserId(articleId, userId);
                decrementLikeCount(articleId);
                System.out.println("按讚記錄已刪除，按讚數已減少");
                return false; // 收回讚
            } else {
                System.out.println("使用者尚未按讚，準備新增按讚記錄");
                ArticleLike like = new ArticleLike();
                like.setArticleId(articleId);
                like.setUserId(userId);
                articleLikeRepository.save(like);
                incrementLikeCount(articleId);
                System.out.println("按讚記錄已新增，按讚數已增加");
                return true; // 按讚成功
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("收回讚或按讚操作失敗: " + e.getMessage(), e);
        }
    }
    
    

    private void incrementLikeCount(Long articleId) {
        // 將文章的按讚數量增加1
        ArticleVo article = articleRepository.findById(articleId)
                .orElseThrow(() -> new IllegalArgumentException("文章不存在"));
        article.setLikes(article.getLikes() + 1);
        articleRepository.save(article);
    }

    private void decrementLikeCount(Long articleId) {
        ArticleVo article = articleRepository.findById(articleId)
                .orElseThrow(() -> new IllegalArgumentException("文章不存在"));
        int currentLikes = article.getLikes();
        if (currentLikes > 0) {
            article.setLikes(currentLikes - 1);
            articleRepository.save(article);
        } else {
            throw new IllegalStateException("無法減少按讚數量，當前按讚數為0");
        }
    }


    public boolean isArticleLiked(Long articleId, Long userId) {
        return articleLikeRepository.existsByArticleIdAndUserId(articleId, userId);
    }

    // 新增或更新文章 根據JpaRepository的方法 它會自動偵測ID是否存在 不存在則新增 存在則更新
    public ArticleVo createOrUpdateArticle(ArticleVo article, Long tagId) {
        Optional<TagVo> tagOptional = tagRepository.findById(tagId);
        System.out.println("backEnd tag id is: "+ tagId);
        if (tagOptional.isPresent()) {
            article.setTag(tagOptional.get());
            return articleRepository.save(article);
        } else {
            throw new IllegalArgumentException("Tag with ID " + tagId + " not found.");
        }
    }
    // 根據ID刪除文章

    public void deleteArticle(Long articleId) {
        articleRepository.deleteById(articleId);
    }

    public Long getTagIdByArticleId(Long articleId) {
        Optional<ArticleVo> article = articleRepository.findById(articleId);
        return article.map(ArticleVo::getTag).map(TagVo::getTag_id).orElse(null);
    }

    // 根據用戶id 獲取特定用戶文章
    public List<ArticleVo> getArticleByAuthorId(Long authorId) {
        return articleRepository.findByAuthorId(authorId);
    }

    public Optional<ArticleVo> findById(Long articleId) {
        return articleRepository.findById(articleId);
    }





    
}
