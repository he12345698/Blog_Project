package com.example.blog.PasswordReset;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.blog.Model.AccountVo;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    PasswordResetToken findByToken(String token);
    List<PasswordResetToken> findByVo(AccountVo vo);
    void deleteByToken(String token);
    PasswordResetToken findByVo_Username(String username);
}