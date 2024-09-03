package com.example.blog.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

import com.example.blog.Model.AccountVo;

public interface AccountRepository extends JpaRepository<AccountVo, Long> {
    // 根據用戶名查詢帳戶
    Optional<AccountVo> findByUsername(String username);
    // 根據電子郵件查詢帳戶
    Optional<AccountVo> findByEmail(String email);
    // 根據驗證 token 查詢帳戶
    Optional<AccountVo> findByVerificationToken(String verificationToken);
    
    Optional<AccountVo> findById(Long id);
    
    @Query("SELECT a.imagelink FROM AccountVo a WHERE a.username = :username")
    String findImageLinkByUsername(@Param("username") String username);

    //查詢作者名稱
    List<AccountVo> findByUsernameContainingIgnoreCase(String username);
}

