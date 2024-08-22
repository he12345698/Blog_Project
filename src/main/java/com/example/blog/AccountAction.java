package com.example.blog;

import java.io.IOException;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.Date;

import org.hibernate.grammars.hql.HqlParser.DateContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import org.springframework.ui.Model;



import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

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
            String checkUserSql = "SELECT COUNT(*) FROM account_vo WHERE username = ?";
            Integer userCount = jdbcTemplate.queryForObject(checkUserSql, new Object[]{vo.getUsername()}, Integer.class);

            if (userCount == null || userCount == 0) {
            	System.out.println("未知的使用者名稱：" + vo.getUsername() + " 於 " + new Date(System.currentTimeMillis()) + " 嘗試登入");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("message", "使用者不存在"));
            }

            // 查询用户的密码、图片链接、登录尝试次数和帐户锁定状态
            String sql = "SELECT password, imagelink, login_attempts, account_locked FROM account_vo WHERE username = ?";
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
                    String lockAccountSql = "UPDATE account_vo SET account_locked = TRUE, login_attempts = 0 WHERE username = ?";
                    jdbcTemplate.update(lockAccountSql, vo.getUsername());
                    System.out.println("使用者：" + vo.getUsername() + " 帳戶已被鎖定，由於多次登錄失敗。");
                    
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Collections.singletonMap("message", "帳戶已被鎖定，請聯繫管理員"));
                } else {
                    // 更新登录尝试次数
                    String updateAttemptsSql = "UPDATE account_vo SET login_attempts = ? WHERE username = ?";
                    jdbcTemplate.update(updateAttemptsSql, loginAttempts, vo.getUsername());
                }

                // 打印错误信息
                System.out.println("使用者：" + vo.getUsername() + " 於 " + new Date(System.currentTimeMillis()) + " 嘗試登入，已錯誤 " + loginAttempts + " 次");
                
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("message", "密碼不正確，已錯誤 " + loginAttempts + " 次"));
            }

            // 密码匹配，重置登录尝试次数并解除锁定
            String resetAttemptsSql = "UPDATE account_vo SET login_attempts = 0, account_locked = FALSE WHERE username = ?";
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
    
    @Autowired
    private EmailService emailService;
    @Autowired
    private PasswordResetTokenService prts;
    @Autowired
    private PasswordResetTokenRepository tokenRepository;
    
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody AccountVo vo) {
        String email = vo.getEmail();
        // 查找是否存在 AccountVo
        AccountVo existingVo = findAccountVoByEmail(email);
        //PasswordResetToken resetToken = tokenService.createPasswordResetTokenForUser(vo);

        if (existingVo == null) {
            return ResponseEntity.badRequest().body("電子郵件不存在");
        }
        
        // 生成随机 token
//        String token = UUID.randomUUID().toString();
//        LocalDateTime expiryDate = LocalDateTime.now().plusHours(1);
//
//        // 使用已存在的 AccountVo 创建 PasswordResetToken
//        PasswordResetToken resetToken = new PasswordResetToken(token, existingVo, expiryDate);
//        tokenRepository.save(resetToken);
     // 创建密码重置令牌并获取生成的令牌
        String token = prts.createPasswordResetTokenForUser(existingVo);
        // 调用 emailService 的方法来发送邮件
        emailService.sendResetPasswordEmail(existingVo, token);

        return ResponseEntity.ok("請檢查您的電子郵件以重設密碼");
    }


	private final PasswordResetTokenService tokenService;
    //private final UserService userService;

    public AccountAction(PasswordResetTokenService tokenService) {
        this.tokenService = tokenService;
        //this.userService = userService;
    }
    
    @PostMapping("/reset-password")
    public String resetPassword(@RequestParam("token") String token, @RequestParam("newPassword") String newPassword) {
        PasswordResetToken resetToken = tokenService.validatePasswordResetToken(token);
        if (resetToken == null) {
            return "Invalid or expired token";
        }
        AccountVo vo = resetToken.getVo();
        changePassword(vo, newPassword);
        System.out.println("new passord is " + newPassword);
        return "Password reset successfully";
    }
    
    public void changePassword(AccountVo vo, String newPassword) {
        // 更新密码的 SQL 语句
        String sql = "UPDATE account_vo SET password = ? WHERE username = ?";

        // 执行更新操作
        int rowsAffected = jdbcTemplate.update(sql, newPassword, vo.getUsername());

        // 检查是否成功更新
        if (rowsAffected == 0) {
            throw new RuntimeException("用户不存在或更新失败");
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
        String sql = "SELECT COUNT(*) FROM account_vo WHERE username = ?";
        Integer count = jdbcTemplate.queryForObject(sql, new Object[]{id}, Integer.class);
        return count != null && count > 0;
    }
    
    public boolean checkEmail(String email) {
        String sql = "SELECT COUNT(*) FROM account_vo WHERE email = ?";
        Integer count = jdbcTemplate.queryForObject(sql, new Object[]{email}, Integer.class);
        return count != null && count > 0;
    }
    
    public AccountVo findAccountVoByEmail(String email) {
        String sql = "SELECT * FROM account_vo WHERE email = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new Object[]{email}, (rs, rowNum) -> {
                AccountVo accountVo = new AccountVo();
                accountVo.setUsername(rs.getString("username"));
                accountVo.setPassword(rs.getString("password"));
                accountVo.setEmail(rs.getString("email"));
                accountVo.setImagelink(rs.getString("imagelink"));
                return accountVo;
            });
        } catch (EmptyResultDataAccessException e) {
            // 如果結果為空，則返回 null 或者處理不存在的情況
            return null;
        }
    }


    public boolean insertUser(AccountVo vo) {
        String sql = "INSERT INTO account_vo (username, password, email) VALUES (?, ?, ?)";
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
