package com.example.blog;

import java.util.List;
import com.example.blog.Articles2;
import com.example.blog.Article2Vo;
import java.util.Map;
import java.util.HashMap;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:3000") // 設定允許的來源網站，這裡是本地的 React 應用
@RestController
@RequestMapping("/blog") // 設定基本路徑
public class ArticleController {
  
    @Autowired ArticleRepository articleRepository;

    @GetMapping("/queryOne")
    public Map queryOne(){
        
        Map rs = new HashMap();
		Articles2 article = articleRepository.findByArticle_id(1L);
		Article2Vo vo = new Article2Vo();
		BeanUtils.copyProperties(article , vo);
		rs.put("success", true);
		rs.put("article", vo);
		return rs;

    }
    

    // @PostMapping
    // public Article2 createArticle(@RequestBody Article2 article) {
    //     // 創建新文章
    //     return articleService.saveArticle(article);
    // }
}
