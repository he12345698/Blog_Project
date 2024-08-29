package com.example.blog.Controller;

import java.util.Date;
import java.util.Map;
import java.util.Random;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.blog.Model.AccountVo;
import com.example.blog.Service.UserProfileService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/userProfile")
public class UserProfileController {

    @Autowired
    private UserProfileService userProfileService;

    // 更新用戶名
    @PutMapping("update-username/{id}")
    public ResponseEntity<String> updateUsername(@PathVariable(value = "id") Long id,
            @RequestBody Map<String, String> requestBody) {
        String newUsername = requestBody.get("username");
        boolean update = userProfileService.updateUsername(id, newUsername);
        if (update) {
            return ResponseEntity.ok("用戶名更新成功");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("用戶名更新失敗");
        }
    }

    // 更新電子郵件
    @PutMapping("update-email/{id}")
    public ResponseEntity<String> updateEmail(@PathVariable Long id, @RequestBody Map<String, String> requestBody) {
        System.out.println(id);
        String newEmail = requestBody.get("email");
        boolean update = userProfileService.updateEmail(id, newEmail);
        if (update) {
            return ResponseEntity.ok("用戶電子郵件更新成功");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("用戶電子郵件更新失敗");
        }
    }

    // 根據用戶名稱獲取用戶資料
    @GetMapping("/{id}")
    public ResponseEntity<AccountVo> getUserById(@PathVariable(value = "id") Long id) {
        AccountVo accountVo = userProfileService.getUserById(id);
        if (accountVo != null) {
            return ResponseEntity.ok(accountVo);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // 上傳圖片
    @PostMapping("/upload-image/{id}")
    public ResponseEntity<String> uploadImage(@RequestParam("image") MultipartFile image,
            @PathVariable(value = "id") Long id) {
        try {
            String imageName = userProfileService.uploadImage(image, id);
            return ResponseEntity.ok("圖片上傳成功, 檔案名稱: " + imageName);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("圖片上傳失敗");
        }
    }

    // 修改圖片
    @PostMapping("replace-image/{id}")
    public ResponseEntity<String> replaceImage(@PathVariable(value = "id") Long id,
            @RequestParam("image") MultipartFile image) {
        try {
            String newImageName = userProfileService.uploadImage(image, id);
            return ResponseEntity.ok("圖片更換成功, 新檔案名稱: " + newImageName);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("圖片更換失敗");
        }
    }

}
