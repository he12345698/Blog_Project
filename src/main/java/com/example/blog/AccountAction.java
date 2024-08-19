package com.example.blog;

import java.io.IOException;
import java.security.Principal;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import org.springframework.ui.Model;



import org.springframework.jdbc.core.JdbcTemplate;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/ac")
public class AccountAction {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/register")
    public String getRegistrationPage() {
        return "Registration API - Use POST method to register.";
    }
    
    @GetMapping("/session")
    public ResponseEntity<Map<String, String>> getSessionUsername(HttpSession session) {
        String username = (String) session.getAttribute("username");
        System.out.println(username);
        if (username != null) {
            Map<String, String> response = new HashMap<>();
            response.put("username", username);
            response.put("userImage", "/path/to/default-image.jpg"); // 添加用户头像 URL
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("error", "未登入"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody AccountVo vo) {
        System.out.println(vo);
        System.out.println(vo.getUsername());

        // 檢查 ID 是否已存在
        if (checkId(vo.getUsername())) {
            return ResponseEntity.badRequest().body("此用戶名已被使用!"); // 用户 ID 已被占用
        }
        if (checkEmail(vo.getEmail())) {
            return ResponseEntity.badRequest().body("此電子信箱已被使用!"); // 邮件地址已被占用
        }

        // 插入新用戶資料到資料庫
        if (insertUser(vo)) {
            return ResponseEntity.ok("註冊成功!"); // 注册成功
        } else {
            return ResponseEntity.status(500).body("註冊失敗，請稍後重試."); // 注册失败
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody AccountVo vo, HttpServletResponse response) {
        try {
            // 查詢用戶名是否存在
            String checkUserSql = "SELECT COUNT(*) FROM test WHERE username = ?";
            Integer userCount = jdbcTemplate.queryForObject(checkUserSql, new Object[]{vo.getUsername()}, Integer.class);

            if (userCount == null || userCount == 0) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("message", "使用者不存在"));
            }

            // 查詢用戶的密碼
            String sql = "SELECT password FROM test WHERE username = ?";
            String storedPassword = jdbcTemplate.queryForObject(sql, new Object[]{vo.getUsername()}, String.class);

            if (storedPassword == null || !storedPassword.equals(vo.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("message", "使用者或密碼不正確"));
            }

            // 密碼匹配，生成 JWT
            String token = JwtUtil.generateToken(vo.getUsername());
            System.out.println(token);
            // 将 JWT 添加到响应头中
            response.setHeader("Authorization", "Bearer " + token);
            System.out.println(response.getHeader("Authorization"));
            // 返回 JSON 对象
            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("message", "登入成功");
            responseBody.put("token", token); // 如果需要返回 token，也可以包含在响应中
            //responseBody.put("username", vo.getUsername());

            return ResponseEntity.ok(responseBody);
        } catch (Exception e) {
        	e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("message", "伺服器錯誤：" + e.getMessage()));
        }
    }

    public boolean checkId(String id) {
        String sql = "SELECT COUNT(*) FROM test WHERE username = ?";
        Integer count = jdbcTemplate.queryForObject(sql, new Object[]{id}, Integer.class);
        return count != null && count > 0;
    }
    
    public boolean checkEmail(String email) {
        String sql = "SELECT COUNT(*) FROM test WHERE email = ?";
        Integer count = jdbcTemplate.queryForObject(sql, new Object[]{email}, Integer.class);
        return count != null && count > 0;
    }

    public boolean insertUser(AccountVo vo) {
        String sql = "INSERT INTO test (username, password, email) VALUES (?, ?, ?)";
        int rowsAffected = jdbcTemplate.update(sql, vo.getUsername(), vo.getPassword(), vo.getEmail());
        return rowsAffected > 0;
    }
    
    
    
    public boolean authenticateUser(String username, String password) {
        // 查詢用戶的密碼
        String sql = "SELECT password FROM test WHERE username = ?";
        String storedPassword = jdbcTemplate.queryForObject(sql, new Object[]{username}, String.class);

        // 如果用戶不存在，返回 false
        if (storedPassword == null) {
            return false;
        }

        // 直接比較提供的密碼與存儲的密碼
        return password.equals(storedPassword);
    }
    
}
