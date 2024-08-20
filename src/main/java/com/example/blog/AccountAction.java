package com.example.blog;

import java.io.IOException;
import java.security.Principal;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Date;

import org.hibernate.grammars.hql.HqlParser.DateContext;
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


@CrossOrigin(origins = "http://niceblog.myvnc.com:81")
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
            return ResponseEntity.badRequest().body("該用戶名已被使用!"); // 用户 ID 已被占用
        }
        if (checkEmail(vo.getEmail())) {
            return ResponseEntity.badRequest().body("該電子信箱已被使用!"); // 邮件地址已被占用
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
            // 查询用户名是否存在
            String checkUserSql = "SELECT COUNT(*) FROM test WHERE username = ?";
            Integer userCount = jdbcTemplate.queryForObject(checkUserSql, new Object[]{vo.getUsername()}, Integer.class);

            if (userCount == null || userCount == 0) {
            	System.out.println("未知的使用者名稱：" + vo.getUsername() + " 於 " + new Date(System.currentTimeMillis()) + " 嘗試登入");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("message", "使用者不存在"));
            }

            // 查询用户的密码、图片链接、登录尝试次数和帐户锁定状态
            String sql = "SELECT password, imagelink, login_attempts, account_locked FROM test WHERE username = ?";
            Map<String, Object> userDetails = jdbcTemplate.queryForMap(sql, new Object[]{vo.getUsername()});

            String storedPassword = (String) userDetails.get("password");
            String imageLink = (String) userDetails.get("imagelink");
            Integer loginAttempts = (Integer) userDetails.get("login_attempts");
            Boolean accountLocked = (Boolean) userDetails.get("account_locked");

            if (Boolean.TRUE.equals(accountLocked)) {
                // 帐户已被锁定
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Collections.singletonMap("message", "帳戶已被鎖定，請聯繫管理員"));
            }

            if (storedPassword == null || !storedPassword.equals(vo.getPassword())) {
                // 密码错误时增加登录尝试次数
                loginAttempts += 1;

                if (loginAttempts >= 3) {
                    // 锁定帐户
                    String lockAccountSql = "UPDATE test SET account_locked = TRUE, login_attempts = 0 WHERE username = ?";
                    jdbcTemplate.update(lockAccountSql, vo.getUsername());
                    System.out.println("使用者：" + vo.getUsername() + " 帳戶已被鎖定，由於多次登錄失敗。");
                    
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Collections.singletonMap("message", "帳戶已被鎖定，請聯繫管理員"));
                } else {
                    // 更新登录尝试次数
                    String updateAttemptsSql = "UPDATE test SET login_attempts = ? WHERE username = ?";
                    jdbcTemplate.update(updateAttemptsSql, loginAttempts, vo.getUsername());
                }

                // 打印错误信息
                System.out.println("使用者：" + vo.getUsername() + " 於 " + new Date(System.currentTimeMillis()) + " 嘗試登入，已錯誤 " + loginAttempts + " 次");
                
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("message", "密碼不正確，已錯誤 " + loginAttempts + " 次"));
            }

            // 密码匹配，重置登录尝试次数并解除锁定
            String resetAttemptsSql = "UPDATE test SET login_attempts = 0, account_locked = FALSE WHERE username = ?";
            jdbcTemplate.update(resetAttemptsSql, vo.getUsername());

            // 生成 JWT
            String token = JwtUtil.generateToken(vo.getUsername(), imageLink);
            System.out.println("使用者：" + vo.getUsername() + " 於 " + new Date(System.currentTimeMillis()) + " 登入，token：" + token);

            // 将 JWT 添加到响应头中
            response.setHeader("Authorization", "Bearer " + token);

            // 返回 JSON 对象
            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("message", "登入成功");
            responseBody.put("token", token); // 如果需要返回 token，也可以包含在响应中

            return ResponseEntity.ok(responseBody);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("message", "伺服器錯誤：" + e.getMessage()));
        }
    }


    
    @PostMapping("/logout-notify")
    public ResponseEntity<String> notifyLogout(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");

        // 处理登出通知，比如保存到数据库或记录日志
        System.out.println("使用者：" + username + " 於 " + new Date(System.currentTimeMillis()) + " 登出");

        return ResponseEntity.ok("登出通知接收成功");
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
