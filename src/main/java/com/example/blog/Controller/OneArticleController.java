package com.example.blog.Controller;

import java.util.List;

import com.example.blog.Model.Article2Vo;
import com.example.blog.Model.Articles2;
import com.example.blog.Repository.OneArticleRepository;

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
public class OneArticleController {
  
    @Autowired OneArticleRepository oneArticleRepository;

    @GetMapping("/queryOne")
    public Map queryOne(){
        
        Map rs = new HashMap();
		Articles2 article = oneArticleRepository.findById(1L);
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
