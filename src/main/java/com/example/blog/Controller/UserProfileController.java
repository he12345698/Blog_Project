package com.example.blog.Controller;

import java.util.Date;
import java.util.Map;
import java.util.Random;
import java.util.UUID;
import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Collections;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.blog.JwtUtil;
import com.example.blog.Model.AccountVo;
import com.example.blog.Repository.AccountRepository;
import com.example.blog.Service.AccountService;
import com.example.blog.Service.UserProfileService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

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

    @Autowired
    private AccountService accountService;

    @Autowired
    private AccountRepository accountRepository;

    // 使用相對路徑，上傳目錄將位於專案的根目錄中
    // private static final String UPLOAD_DIR = "D:\\Project_ex\\Blog_Project\\frontend\\public\\";
    // private static final String UPLOAD_DIR = "E:\\Blog_Project\\frontend\\public\\";

    // 更新用戶名
    @PutMapping("update-username/{id}")
    public ResponseEntity<String> updateUsername(@PathVariable(value = "id") Long id,
            @RequestBody Map<String, String> requestBody) {
        String newUsername = requestBody.get("username");

        // 檢查新的用戶名是否已存在
        if (accountRepository.findByUsername(newUsername).isPresent()) {
            return ResponseEntity.badRequest().body("該用戶名已被使用!");
        }
        
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
        String newEmail = requestBody.get("email");
        boolean update = userProfileService.updateEmail(id, newEmail);
        if (update) {
            return ResponseEntity.ok("用戶電子郵件更新成功");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("用戶電子郵件更新失敗");
        }
    }

    // 更新密碼
    @PutMapping("update-password/{id}")
    public ResponseEntity<String> updatePassword(@PathVariable Long id, @RequestBody Map<String, String> requestBody) {
        String newPassword = requestBody.get("newPassword");
        boolean update = userProfileService.updatePassword(id, newPassword);
        if (update) {
            return ResponseEntity.ok("用戶密碼更新成功");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("用戶密碼更新失敗");
        }
    }

    @GetMapping("/{identifier}")
    public ResponseEntity<Map<String, Object>> getUserByIdentifier(@PathVariable("identifier") String identifier) {
        try {
            // 嘗試將 identifier 轉換為 Long，如果成功則按 ID 查詢
            Long id = Long.parseLong(identifier);
            return getUserById(id);
        } catch (NumberFormatException e) {
            // 如果不能轉換為 Long，則按用戶名查詢
            return getUserByName(identifier);
        }
    }
    
    // 根據用戶名稱獲取用戶資料				
    //@GetMapping("/{id:[0-9]+}")  // 匹配長整型數字的路徑變量
    public ResponseEntity<Map<String, Object>> getUserById(@PathVariable(value = "id") Long id) {
        AccountVo accountVo = userProfileService.getUserById(id);
        if (accountVo != null) {
            Map<String, Object> response = new HashMap<>();
            response.put("username", accountVo.getUsername());
            response.put("email", accountVo.getEmail());
            response.put("createdDate", accountVo.getCreatedDate());
            response.put("lastLoginDate", accountVo.getLastLoginDate());
            response.put("imagelink", accountVo.getImagelink());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    //@GetMapping("/{username:[a-zA-Z0-9._-]+}")  // 匹配字符串的路徑變量
    public ResponseEntity<Map<String, Object>> getUserByName(@PathVariable(value = "username") String username) {
        AccountVo accountVo = userProfileService.getUserByUsername(username);
        if (accountVo != null) {
            Map<String, Object> response = new HashMap<>();
            response.put("username", accountVo.getUsername());
            response.put("id", accountVo.getId());
            response.put("email", accountVo.getEmail());
            response.put("createdDate", accountVo.getCreatedDate());
            response.put("lastLoginDate", accountVo.getLastLoginDate());
            response.put("imagelink", accountVo.getImagelink());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping("/upload-image/{id}")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file,
            @PathVariable(value = "id") Long id) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("請選擇一個檔案來上傳。");
        }

        final long MAX_SIZE = 10 * 1024 * 1024;
        if (file.getSize() > MAX_SIZE) {
            return ResponseEntity.badRequest().body("圖片大小超過10MB限制");
        }

        try {

            String uploadDir = new File(System.getProperty("user.dir")).getAbsolutePath() + File.separator + "frontend" + File.separator + "public";

            // 查詢資料庫以獲取原有的圖片路徑
            AccountVo accountVo = userProfileService.getUserById(id);
            String url = accountVo.getImagelink();
            if (url != null && !url.isEmpty()) {
                try {
                    URL urlObj = new URL(url);
                    String path = urlObj.getPath();
                    String localFilePath = uploadDir + path.replace('/', File.separatorChar);

                    Path existingFilePath = Paths.get(localFilePath);
                    System.out.println("要刪除的檔案路徑: " + existingFilePath);

                    // 檢查文件是否存在
                    if (Files.exists(existingFilePath)) {
                        Files.delete(existingFilePath);
                        System.out.println("成功刪除原有圖片：" + existingFilePath);
                    } else {
                        System.out.println("原有圖片不存在：" + existingFilePath);
                    }
                } catch (MalformedURLException e) {
                    System.err.println("圖片 URL 格式錯誤：" + e.getMessage());
                } catch (IOException e) {
                    System.err.println("刪除原有圖片時出錯：" + e.getMessage());
                } catch (SecurityException e) {
                    System.err.println("無法刪除圖片，權限不足：" + e.getMessage());
                }
            }

            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(uploadDir, "UserImages/", fileName);
            System.out.println("Saving new file to: " + filePath);

            Files.createDirectories(filePath.getParent());
            Files.write(filePath, file.getBytes());
            
            String baseUrl = "http://localhost:3000/";
            // String baseUrl = "http://localhost:81/";
            String relativeImagePath = "UserImages/" + fileName;
            String fullImageUrl = baseUrl + relativeImagePath;

            userProfileService.updateUserImagePath(id, fullImageUrl);

            String jsonResponse = String.format("{\"filePath\":\"%s\"}", fullImageUrl);
            return ResponseEntity.ok().body(jsonResponse);
        } catch (MalformedURLException e) {
            System.err.println("URL 格式錯誤：" + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("無效的圖片 URL 格式。");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("上傳檔案時發生錯誤。");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("處理請求時發生錯誤。");
        }
    }

}