package com.example.blog;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/articles")
public class OneArticleController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/{articleId}")
    public Map<String, Object> getArticle(@PathVariable int articleId) {
        // 查詢文章信息
        String articleQuery = """
            SELECT a.title, a.content, a.published_at
            FROM Articles a
            WHERE a.article_id = ?
            """;
        
        Map<String, Object> article = jdbcTemplate.queryForMap(articleQuery, articleId);
        // u.username, u.avatar_url
 // JOIN Users u ON a.author_id = u.user_id

        // 查詢文章的評論
        // String commentsQuery = """
        // SELECT c.content, c.commented_at, u.username, u.avatar_url
        // FROM Comments c
        // JOIN Users u ON c.user_id = u.user_id
        // WHERE c.article_id = ?
        // ORDER BY c.commented_at ASC;
        // """;

        // List<Map<String, Object>> comments = jdbcTemplate.queryForList(commentsQuery, articleId);

   
        // article.put("comments", comments);

        return article;
    }
}


