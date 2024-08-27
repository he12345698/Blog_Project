package com.example.blog;

import java.util.List;
import com.example.blog.Articles2;
import com.example.blog.OneArticleRepository;
import java.util.Map;
import java.util.Optional;
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
  
    @Autowired OneArticleRepository articleRepository;

    @GetMapping("/queryOne")
public Map<String, Object> queryOne() {
    Map<String, Object> rs = new HashMap<>();
    Optional<Articles2> articleOptional = articleRepository.findById(1L);

    if (articleOptional.isPresent()) {
        Articles2 article = articleOptional.get();
        Article2Vo vo = new Article2Vo();
        BeanUtils.copyProperties(article, vo);
        rs.put("success", true);
        rs.put("article", vo);
    } else {
        rs.put("success", false);
        rs.put("message", "Article not found");
    }

    return rs;
}
    
}
