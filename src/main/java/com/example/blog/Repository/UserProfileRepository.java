package com.example.blog.repository;

import java.util.List;

import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.blog.Model.AccountVo;

import jakarta.transaction.Transactional;


@Repository
public interface UserProfileRepository extends JpaRepository<AccountVo, String>{
	// 你可以在這裡定義一些自定義查詢方法，比如通過標題查詢文章
    //Spring Data JPA 使用方法名稱來推斷查詢邏輯。只要你新增的方法名稱不與預設方法重名，這些方法就能獨立運作，互不干涉。
    //自定義方法findBy:查詢 Title:屬性名稱 Containing:

    // 修改用戶名稱
    @Modifying
    @Transactional
    @Query("UPDATE AccountVo aVo SET aVo.username = :newUsername WHERE aVo.username = :currentUsername")
    int updateUsername(String currentUsername, String newUsername);

    // 修改用戶電子郵件
    @Modifying
    @Transactional
    @Query("UPDATE AccountVo aVo SET aVo.email = :newEmail WHERE aVo.username = :username")
    int updateEmail(String username, String newEmail);

    // 利用用戶名稱 找尋特定用戶資料
    AccountVo findByUsername(String username);
}
