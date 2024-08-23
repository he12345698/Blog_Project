package com.example.blog.PasswordReset;

import org.springframework.stereotype.Service;

import com.example.blog.AccountVo;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PasswordResetTokenService {

    private final PasswordResetTokenRepository tokenRepository;

    public PasswordResetTokenService(PasswordResetTokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    public String createPasswordResetTokenForUser(AccountVo vo) {
        String token = UUID.randomUUID().toString();
        LocalDateTime expiryDate = LocalDateTime.now().plusHours(1); // 令牌有效期 1 小時
        System.out.println("LocalDateTime.now ?? " + LocalDateTime.now());
        PasswordResetToken resetToken = new PasswordResetToken(token, vo, expiryDate);
        tokenRepository.save(resetToken);
        
        return token;
    }

    public PasswordResetToken validatePasswordResetToken(String token) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token);
        System.out.println("Token ?? " + token);
        System.out.println("resetToken ?? " + resetToken.getExpiryDate());
        System.out.println("LocalDateTime.now ?? " + LocalDateTime.now());
        System.out.println("token is before ?? " + resetToken.getExpiryDate().isBefore(LocalDateTime.now()));
        if (resetToken == null || resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {

            return null; // 令牌無效或過期
        }

        return resetToken;
    }
}
