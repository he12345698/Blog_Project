package com.example.blog.Controller;

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

import com.example.blog.JwtUtil;
import com.example.blog.Model.AccountVo;

import com.example.blog.PasswordReset.PasswordResetToken;
import com.example.blog.PasswordReset.PasswordResetTokenRepository;
import com.example.blog.PasswordReset.PasswordResetTokenService;
import com.example.blog.Service.AccountService;
import com.example.blog.Service.EmailService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import org.springframework.ui.Model;



import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

// @CrossOrigin(origins = "http://niceblog.myvnc.com:81")
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/ac")
public class AccountAction {
	

    @Autowired
    private JdbcTemplate jdbcTemplate;
    @Autowired 
    private AccountService accountService;
    @Autowired
    private CaptchaController captchaController;

    @GetMapping("/register")
    public String getRegistrationPage() {
        return "Registration API - Use POST method to register.";
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody AccountVo vo) {

    	ResponseEntity<String> response = accountService.registerUser(vo);
        return response;
        
    }
    
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody AccountVo vo, HttpServletRequest request, HttpServletResponse response) {
        try {
            
        	ResponseEntity<Map<String, String>> captchaResponse = captchaController.validateCaptcha(vo, request);
            // 如果验证码验证失败，直接返回错误响应
            if (captchaResponse.getStatusCode() == HttpStatus.FORBIDDEN) {
                return captchaResponse; // 返回包含错误信息的响应
            }

            // 查询用户名是否存在
            if (!checkId(vo.getUsername())) {
                System.out.println("未知的使用者名稱：" + vo.getUsername() + " 於 " + new Date(System.currentTimeMillis()) + " 嘗試登入");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("message", "使用者不存在"));
            }

            // 调用 AccountService 的 checkUserPassword 方法
            ResponseEntity<String> checkUserPasswordResponse = accountService.checkUserPassword(vo.getUsername(), vo.getPassword());
            if (checkUserPasswordResponse.getStatusCode() == HttpStatus.UNAUTHORIZED || checkUserPasswordResponse.getStatusCode() == HttpStatus.FORBIDDEN) {
                // 将错误信息封装为 Map
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", checkUserPasswordResponse.getBody());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }

            // 如果验证成功，生成 JWT
            if (checkUserPasswordResponse.getStatusCode() == HttpStatus.OK) {
            	
                String token = JwtUtil.generateToken(vo.getUsername(), accountService.checkImageLink(vo.getUsername())); 
                // 将 JWT 添加到响应头中
                System.out.println("imagelink is " + accountService.checkImageLink(vo.getUsername()));
                response.setHeader("Authorization", "Bearer " + token);
                System.out.println(token);
                // 返回 JSON 对象
                Map<String, String> responseBody = new HashMap<>();
                responseBody.put("token", token);

                return ResponseEntity.ok(responseBody);
            }
//            } else {
//                // 返回服务层返回的错误信息
//                Map<String, String> responseBody = Collections.singletonMap("message", serviceResponse.getBody());
//                return new ResponseEntity<>(responseBody, serviceResponse.getStatusCode());
//            }
//            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("message", "伺服器錯誤：" + e.getMessage()));
        }
		return null;
    }

    
    private boolean checkAccountLocked(String username) {
		// TODO Auto-generated method stub
		return false;
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
