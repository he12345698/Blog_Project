package com.example.blog.controller;

import org.hibernate.mapping.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.support.Repositories;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.blog.Model.AccountVo;
import com.example.blog.service.UserProfileService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
// @CrossOrigin(origins = "http://niceblog.myvnc.com:81")
@CrossOrigin(origins = "localhost:3000")
@RequestMapping("/api/userProfile")
public class UserProfileController {

    @Autowired
    UserProfileService userProfileService;

    // 更新用戶名
    @PutMapping("/update-username/{ username }")
    public ResponseEntity<String> updateUsername(@PathVariable(value = "username") String username, @RequestBody String newUsername){
        boolean success = userProfileService.updateUsername(username, newUsername);
        if (success) {
            return ResponseEntity.ok("用戶名更新成功");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("用戶名更新失敗");
        }
    }

    // 更新電子郵件
    @PutMapping("update-email/{username}")
    public ResponseEntity<String> putMethodName(@PathVariable String username, @RequestBody String newEmail) {
        boolean success = userProfileService.updateEmail(username, newEmail);
        if (success) {
            return ResponseEntity.ok("用戶電子郵件更新成功");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("用戶電子郵件更新失敗");
        }
    }

    // 根據用戶名稱獲取用戶資料
    @GetMapping("/{ username }")
    public ResponseEntity<AccountVo> getUserByUsername(@PathVariable(value = "username") String username){
        AccountVo accountVo = userProfileService.getUserByUsername(username);
        if (accountVo != null) {
            return ResponseEntity.ok(accountVo);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
