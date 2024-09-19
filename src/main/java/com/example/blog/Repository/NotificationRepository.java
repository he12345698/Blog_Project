package com.example.blog.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.blog.Model.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // 根據用戶 ID 和讀取狀態查找通知
    List<Notification> findByUserIdAndIsRead(Long userId, boolean isRead);
    
 // 根据用户ID查找所有未读通知
    List<Notification> findByUserIdAndIsReadFalse(Long userId);

    // 根据用户ID获取所有通知
    List<Notification> findByUserId(Long userId);
}

