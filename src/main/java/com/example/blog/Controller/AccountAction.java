package com.example.blog.Controller;

import java.io.IOException;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
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
import com.example.blog.Repository.AccountRepository;
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
import org.fusesource.jansi.Ansi;
import org.fusesource.jansi.AnsiConsole;

@RestController
@RequestMapping("/ac")
public class AccountAction {

    @Autowired
    private JdbcTemplate jdbcTemplate;
    @Autowired
    private AccountService accountService;
    @Autowired
    private CaptchaController captchaController;
    @Autowired
    private EmailService emailService;
    @Autowired
    private PasswordResetTokenService prts;
    @Autowired
    private AccountRepository accountRepository;

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
    public ResponseEntity<Map<String, String>> login(@RequestBody AccountVo vo, HttpServletRequest request,
            HttpServletResponse response) {
        try {
            ResponseEntity<Map<String, String>> captchaResponse = captchaController.validateCaptcha(vo, request);
            // 回應驗證碼輸入結果
            if (captchaResponse.getStatusCode() == HttpStatus.FORBIDDEN) {
                return captchaResponse; // 返回包含错误信息的响应
            }

            // 查詢用戶是否存在
            if (!accountService.checkId(vo.getUsername())) {
                System.out.println("\033[0;31m" + "未知的使用者名稱：" + vo.getUsername() + " 於 "
                        + new Date(System.currentTimeMillis()) + " 嘗試登入" + "\033[0m");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("message", "使用者不存在"));
            }

            // 確認用戶是否處於鎖定狀態
            if (accountService.checkAccountLocked(vo.getUsername())) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Collections.singletonMap("message", "帳戶已被鎖定，請聯繫管理員"));
            }

            // 调用 AccountService 的 checkUserPassword 方法
            ResponseEntity<String> checkUserPasswordResponse = accountService.checkUserPassword(vo.getUsername(),
                    vo.getPassword());
            if (checkUserPasswordResponse.getStatusCode() == HttpStatus.UNAUTHORIZED
                    || checkUserPasswordResponse.getStatusCode() == HttpStatus.FORBIDDEN) {
                // 将错误信息封装为 Map
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", checkUserPasswordResponse.getBody());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            System.out.println("\033[0;32m" + "使用者：" + vo.getUsername() + " 於 " + new Date(System.currentTimeMillis())
                    + " 登入" + "\033[0m");

            // 如果验证成功，生成 JWT
            if (checkUserPasswordResponse.getStatusCode() == HttpStatus.OK) {

//                String token = JwtUtil.generateToken(
//                		accountRepository.findByUsername(vo.getUsername()).get().getId(),
//                        vo.getUsername(),
//                        accountRepository.findImageLinkByUsername(vo.getUsername()),
//                        vo.getPassword(),accountRepository.findByUsername(vo.getUsername()).get().getEmail());
            	String token = JwtUtil.generateToken(
                		accountRepository.findByUsername(vo.getUsername()).get().getId());
                System.out.println("id is(at login) " + accountRepository.findByUsername(vo.getUsername()).get().getId());
                // 将 JWT 添加到响应头中
                response.setHeader("Authorization", "Bearer " + token);
                System.out.println("已生成token:" + token);
                // 返回 JSON 对象
                Map<String, String> responseBody = new HashMap<>();
                responseBody.put("token", token);

                return ResponseEntity.ok(responseBody);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("message", "伺服器錯誤：" + e.getMessage()));
        }
        return null;
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody AccountVo vo) {
        // 查找是否存在 AccountVo
        Optional<AccountVo> existingVo = accountRepository.findByEmail(vo.getEmail());
        if (existingVo == null) {
            return ResponseEntity.badRequest().body("電子郵件不存在");
        }

        // 创建密码重置令牌并获取生成的令牌
        String token = prts.createPasswordResetTokenForUser(existingVo.get());

        // 调用 emailService 的方法来发送邮件
        emailService.sendResetPasswordEmail(existingVo.get(), token);

        return ResponseEntity.ok("請檢查您的電子郵件以重設密碼");
    }

    @PostMapping("/reset-password")
    public String resetPassword(@RequestParam("token") String token, @RequestParam("newPassword") String newPassword) {
        PasswordResetToken resetToken = prts.validatePasswordResetToken(token);
        if (resetToken == null) {
            return "失效或過期的憑證";
        }
        accountService.changePassword(resetToken.getVo(), newPassword);

        return "密碼重設完成！";
    }

    @PostMapping("/logout-notify")
    public ResponseEntity<String> notifyLogout(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        // 後臺打印登出通知
        System.out.println(
                "\033[0;31m" + "使用者：" + username + " 於 " + new Date(System.currentTimeMillis()) + " 登出" + "\033[0m");

        return ResponseEntity.ok("登出通知接收成功");
    }

    @GetMapping("/verify-email")
    public ResponseEntity<Map<String, String>> verifyAccount(@RequestParam("token") String token) {
        String message = emailService.verifyEmail(token);

        if (message.equals("無效的驗證連結") || message.equals("驗證連結已過期")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Collections.singletonMap("message", message));
        }

        return ResponseEntity.ok(Collections.singletonMap("message", message));
    }
}
