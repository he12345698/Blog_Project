package com.example.blog.Service;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.blog.Model.AccountVo;
import com.example.blog.repository.UserProfileRepository;

@Service
public class UserProfileService {

    @Autowired
    private UserProfileRepository userProfileRepository;

    // 上傳圖片
    public void updateUserImagePath(Long id, String imagePath) {
        AccountVo accountVo = userProfileRepository.findById(id).orElseThrow(() -> new RuntimeException("無此用戶"));
        System.out.println(imagePath);
        accountVo.setImagelink(imagePath); // 假設你的User實體有一個setImageLink的方法
        userProfileRepository.save(accountVo);
    }

    // 根據用戶名獲取用戶資料
    public AccountVo getUserById(Long id) {
        return userProfileRepository.findById(id).orElse(null);
    }

    // 更新用戶名
    public boolean updateUsername(Long id, String newUsername) {
        Optional<AccountVo> optionalAccount = userProfileRepository.findById(id);
        if (optionalAccount.isPresent()) {
            AccountVo account = optionalAccount.get();
            account.setUsername(newUsername);
            userProfileRepository.save(account);
            return true;
        }
        return false;
    }

    // 更新電子郵件
    public boolean updateEmail(Long id, String newEmail) {
        Optional<AccountVo> optionalAccount = userProfileRepository.findById(id);
        if (optionalAccount.isPresent()) {
            AccountVo account = optionalAccount.get();
            account.setEmail(newEmail);
            userProfileRepository.save(account);
            return true;
        }
        return false;
    }

}
