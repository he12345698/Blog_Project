package com.example.blog.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.blog.Model.AccountVo;
import com.example.blog.Repository.UserProfileRepository;


@Service
public class UserProfileService {

    @Autowired
    private UserProfileRepository userProfileRepository;

    // 建立圖片的資料夾路徑
    private final static String FILE_UPLOAD_PATH = "../../../../../resources/static/Image";

    // 上傳圖片
    public String uploadImage(MultipartFile image, Long id) throws IOException {
        if (image.isEmpty()) {
            throw new IllegalArgumentException("找不到圖片");
        }

        // 獲取檔案的完整名稱(xxxx.png/xxx.jpg)
        String imageName = image.getOriginalFilename();
        // 獲取文件擴展名 "."之後的文字(.png/.jpg)
        String suffixName = imageName.substring(imageName.lastIndexOf("."));

        // 生成新的文件名
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMdd_HHmmss");
        Random random = new Random();
        StringBuilder tempName = new StringBuilder();
        tempName.append(simpleDateFormat.format(new Date())).append(random.nextInt(100)).append(suffixName);
        String newImageName = tempName.toString();

        // 保存圖片
        Path path = Paths.get(FILE_UPLOAD_PATH + newImageName);
        Files.write(path, image.getBytes());

        // 更新資料庫中的路徑
        Optional<AccountVo> optionalAccountVo = userProfileRepository.findById(id);
        if (optionalAccountVo.isPresent()) {
            AccountVo accountVo = optionalAccountVo.get();
            accountVo.setImagelink(newImageName); // 設置圖片路徑
            userProfileRepository.save(accountVo); // 保存
        } else {
            throw new IllegalArgumentException("無此用戶");
        }

        return newImageName;
    }

    // 更換圖片
    public String replaceImage(MultipartFile image, Long id) throws IOException {
        if (image.isEmpty()) {
            throw new IllegalArgumentException("找不到圖片");
        }

        // 獲取新圖片名稱
        String imageName = image.getOriginalFilename();
        String suffixName = imageName.substring(imageName.lastIndexOf("."));
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMdd_HHmmss");
        Random random = new Random();
        StringBuilder tempName = new StringBuilder();
        tempName.append(simpleDateFormat.format(new Date())).append(random.nextInt(100)).append(suffixName);
        String newImageName = tempName.toString();

        // 獲取用戶資料
        Optional<AccountVo> optionalAccountVo = userProfileRepository.findById(id);
        if (optionalAccountVo.isPresent()) {
            AccountVo accountVo = optionalAccountVo.get();

            // 刪除圖片（如果存在）
            String oldImageName = accountVo.getImagelink();
            if (oldImageName != null && !oldImageName.isEmpty()) {
                Path oldImagePath = Paths.get(FILE_UPLOAD_PATH + oldImageName);
                Files.deleteIfExists(oldImagePath);
            }

            // 保存新圖片
            Path path = Paths.get(FILE_UPLOAD_PATH + newImageName);
            Files.write(path, image.getBytes());

            // 更新資料庫中的路徑
            accountVo.setImagelink(newImageName);
            userProfileRepository.save(accountVo);

            return newImageName;
        } else {
            throw new IllegalArgumentException("找不到用戶");
        }
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
