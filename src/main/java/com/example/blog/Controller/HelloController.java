package com.example.blog.Controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:3000") // 如果你的React運行在3000端口
@RestController
@RequestMapping("/api") // 基本路由
public class HelloController {

    @GetMapping("/hello") // 特定路由
    public String sayHello() {
        return "Hello, World!";
    }
}
