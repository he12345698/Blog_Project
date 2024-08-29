package com.example.blog.Controller;

import java.util.HashMap;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.blog.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api")
public class UserController {

	@GetMapping("/protected-endpoint")
    public ResponseEntity<Map<String, String>> getProtectedData(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "").trim();
            String username = JwtUtil.extractUsername(token);
            String userImage = JwtUtil.extractImageLink(token);

            if (username == null || !JwtUtil.validateToken(token, username)) {
                Map<String, String> responseBody = new HashMap<>();
                responseBody.put("message", "无效的令牌");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseBody);
            }

            // 生成保护的数据
            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("username", username); // 添加 username 字段
            responseBody.put("userImage", userImage); // 示例头像
            return ResponseEntity.ok(responseBody);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("message", "服务器错误：" + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseBody);
        }
    }
}
