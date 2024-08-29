package com.example.blog.Controller;

import java.util.Date;
import java.util.Map;
import java.util.Random;
import java.util.UUID;
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

    // 使用相對路徑，上傳目錄將位於專案的根目錄中
    private static final String UPLOAD_DIR = "frontend/public/UserImages/";

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

    @PostMapping("/upload-image/{id}")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file, @PathVariable(value = "id") Long id) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("請選擇一個檔案來上傳。");
        }

        // 圖片大小限制在10MB以下
        final long MAX_SIZE = 10 * 1024 * 1024;
        if (file.getSize() > MAX_SIZE) {
            throw new IllegalArgumentException("圖片大小超過10MB限制");
        }

        // 查詢資料庫以獲取原有的圖片路徑
        AccountVo accountVo = userProfileService.getUserById(id);
        String existingImagePath = "frontend/" + accountVo.getImagelink().toString();
        System.out.println(existingImagePath);

        // 如果存在原有的圖片，刪除它
        if (existingImagePath != null) {
            Path existingFilePath = Paths.get(existingImagePath);
            try {
                boolean deleted = Files.deleteIfExists(existingFilePath);
                if (!deleted) {
                    System.err.println("無法刪除原有圖片：" + existingFilePath);
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        

        try {
            // 生成唯一的檔案名稱
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR, fileName);

            // 確保目錄存在，創建上傳目錄（包括所有父目錄）
            Files.createDirectories(filePath.getParent());

            // 儲存檔案到指定目錄
            Files.write(filePath, file.getBytes());

            // 只保留 "public/UserImages/...jpg" 部分
            // 生成相對路徑並保留反斜線
            Path netPath = Paths.get("http://localhost:8080","public", "UserImages", fileName);
            String relativeImagePath = netPath.toString();

            // 更新資料庫中的圖片路徑
            userProfileService.updateUserImagePath(id, relativeImagePath);

            // 構建返回的 JSON
            String jsonResponse = String.format("{\"filePath\":\"%s\"}", filePath.toString().replace("\\", "\\\\"));

            // 返回檔案的路徑
            return ResponseEntity.ok().body(jsonResponse);
        } catch (IOException e) {
            e.printStackTrace(); // 打印異常堆疊以幫助調試
            return ResponseEntity.status(500).body("上傳檔案時發生錯誤。");
        }
    }


}
