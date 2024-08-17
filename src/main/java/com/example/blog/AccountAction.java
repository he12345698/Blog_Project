package com.example.blog;

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

import jakarta.servlet.http.HttpSession;

import org.springframework.ui.Model;



import org.springframework.jdbc.core.JdbcTemplate;

// @SpringBootApplication
// @CrossOrigin(origins = "http://niceblog.myvnc.com:81")
@CrossOrigin(origins = "localhost:3000")
@RestController
@RequestMapping("/ac")
public class AccountAction {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/register")
    public String getRegistrationPage() {
        return "Registration API - Use POST method to register.";
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
    public ResponseEntity<String> login(@RequestBody AccountVo vo, HttpSession session) {
        try {
            // 查询用户的密码
            String sql = "SELECT password FROM test WHERE username = ?";
            String storedPassword = jdbcTemplate.queryForObject(sql, new Object[]{vo.getUsername()}, String.class);

            // 如果用户不存在，返回 401 状态码
            if (storedPassword == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("用戶名或密碼不正確");
            }

            // 比较提供的密码和存储的密码（未加密）
            // 如果需要加密，请将以下代码替换为密码加密验证
            if (storedPassword.equals(vo.getPassword())) {
                session.setAttribute("username", vo.getUsername());
                return ResponseEntity.ok("登入成功");
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("用戶名或密碼不正確");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("伺服器錯誤：" + e.getMessage());
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
    
    @GetMapping("/session")
    public ResponseEntity<String> getSessionUsername(HttpSession session) {
        String username = (String) session.getAttribute("username");
        System.out.println(username);
        if (username != null) {
            return ResponseEntity.ok(username);
        } else {
            return ResponseEntity.status(401).body("未登入");
        }
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
