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

@RestController
@RequestMapping("/api")
public class UserController {

    @GetMapping("/protected-endpoint")
    public ResponseEntity<Map<String, String>> getProtectedData(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        // 檢查 Authorization 頭是否存在
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("message", "缺少或無效的 Authorization 頭");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseBody);
        }

        try {
            String token = authHeader.replace("Bearer ", "").trim();
            String username = JwtUtil.extractUsername(token);
            Long id = JwtUtil.extractId(token);
            String userImage = JwtUtil.extractImageLink(token);

            // 檢查 token 和 username 的有效性
            if (username == null || id == null || !JwtUtil.validateToken(token, username)) {
                Map<String, String> responseBody = new HashMap<>();
                responseBody.put("message", "无效的令牌");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseBody);
            }

            // 生成保护的数据
            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("username", username);
            responseBody.put("id", String.valueOf(id));
            responseBody.put("userImage", userImage);
            return ResponseEntity.ok(responseBody);

        } catch (Exception e) {
            // 具體捕獲異常並返回錯誤信息
            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("message", "服务器错误：" + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseBody);
        }
    }
}
