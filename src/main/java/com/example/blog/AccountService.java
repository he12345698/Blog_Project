package com.example.blog;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;
    
    @Autowired
    private EmailService emailService;
    
//    @Autowired
//    private PasswordEncoder passwordEncoder; // 用於密碼加密和比對
    
    // 檢查用戶名是否已存在
    public boolean checkId(String username) {
        return accountRepository.findByUsername(username).isPresent();
    }

    // 檢查電子郵件是否已存在
    public boolean checkEmail(String email) {
        return accountRepository.findByEmail(email).isPresent();
    }
    
    // 檢查帳戶是否鎖定
    public boolean checkAccountLocked(String username) {
        return accountRepository.findByUsername(username)
                                .map(AccountVo::getAccountLocked)
                                .orElse(false);
    }
    
//    public boolean checkUserPassword(String username, String password) {
//        // 查找用戶
//        Optional<AccountVo> optionalAccount = accountRepository.findByUsername(username);
//
//        if (optionalAccount.isPresent()) {
//            AccountVo account = optionalAccount.get();
//            // 比對密碼
//            return passwordEncoder.matches(password, account.getPassword());
//        }
//        // 用戶不存在
//        return false;
//    }
    
    // 保存帳戶信息
    public AccountVo saveAccount(AccountVo vo) {
        return accountRepository.save(vo);
    }
    
    // 插入新用戶資料
    public boolean insertUser(AccountVo vo) {
        try {
            String token = generateVerificationToken();
            vo.setVerificationToken(token);
            vo.setTokenExpiration(LocalDateTime.now().plusHours(24));
            accountRepository.save(vo);
            // 發送郵件
            //emailService.sendRegistrationEmail(vo.getEmail(), vo.getUsername(), token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
    public ResponseEntity<String> registerUser(AccountVo vo) {

        // 檢查用戶名是否已存在
        if (accountRepository.findByUsername(vo.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("該用戶名已被使用!");
        }

        // 檢查電子郵件是否已存在
        if (accountRepository.findByEmail(vo.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("該電子信箱已被使用!");
        }

        // 插入新用戶資料
        try {
        	
           if(insertUser(vo)) {
        	   
        	   return ResponseEntity.ok("註冊成功! 請檢查您的電子郵件以完成註冊。");
           }
        } catch (Exception e) {
        	
            return ResponseEntity.status(500).body("註冊失敗，請稍後重試。");
        }
        
		return null;
    }

    // 根據用戶名查找帳戶
    public Optional<AccountVo> findByUsername(String username) {
        return accountRepository.findByUsername(username);
    }

    // 根據電子郵件查找帳戶
    public Optional<AccountVo> findByEmail(String email) {
        return accountRepository.findByEmail(email);
    }

    // 根據驗證 token 查找帳戶
    public Optional<AccountVo> findByVerificationToken(String verificationToken) {
        return accountRepository.findByVerificationToken(verificationToken);
    }
    
    //生成隨機驗證帳戶的token
    private String generateVerificationToken() {
        // 實現 token 生成邏輯，這裡只是一個示例
        return java.util.UUID.randomUUID().toString();
    }
    
    //設置生成的token至資料庫
    public void setVerificationToken(AccountVo vo) {
        String token = generateVerificationToken(); // 自定義方法生成驗證 token
        vo.setVerificationToken(token);
        vo.setTokenExpiration(LocalDateTime.now().plusHours(24));  // 設置24小時過期時間
        accountRepository.save(vo);  // 保存帳戶
    }
    
    // 驗證帳戶
    public boolean verifyAccount(String token) {
        Optional<AccountVo> accountOpt = findByVerificationToken(token);
        if (accountOpt.isPresent()) {
            AccountVo account = accountOpt.get();
            account.setIsVerified(true);
            account.setVerificationToken(null);  // 驗證後移除 token
            saveAccount(account);
            return true;
        }
        return false;
    }
    
    
}
