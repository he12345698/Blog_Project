package com.example.blog.PasswordReset;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.blog.Model.AccountVo;
import com.example.blog.Repository.AccountRepository;
//import com.example.blog.AccountVo;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PasswordResetTokenService {

	@Autowired 
	PasswordResetTokenRepository tokenRepository;
    
    @Autowired 
    AccountRepository accountRepository;

    public PasswordResetTokenService(PasswordResetTokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    public String createPasswordResetTokenForUser(AccountVo vo) {
        String token = UUID.randomUUID().toString();
        LocalDateTime expiryDate = LocalDateTime.now().plusHours(1); // 令牌有效期 1 小時
        // 检查 `AccountVo` 是否已经被保存，如果没有，则保存
        if (vo.getId() == null) {  // 假设 `id` 是 `AccountVo` 的主键字段
            vo = accountRepository.save(vo);
        }
        PasswordResetToken resetToken = new PasswordResetToken(token, vo, expiryDate);
        tokenRepository.save(resetToken);
        
        return token;
    }

    public PasswordResetToken validatePasswordResetToken(String token) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token);

        if (resetToken == null || resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {

            return null; // 令牌無效或過期
        }

        return resetToken;
    }
}
