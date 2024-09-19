package com.example.blog.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.example.blog.Model.Notification;
import com.example.blog.Service.NotificationService;
import com.mysql.cj.exceptions.PasswordExpiredException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    @Autowired
    private NotificationService notificationService;
    // 发送通知的端点
//    @PostMapping("/send")
//    public String sendNotification(@RequestBody Notification request) {
//        // 假设 NotificationRequest 是你定义的一个类，用来封装通知请求的参数
//        String destination = "/topic/notifications/" + request.getUser();
//        messagingTemplate.convertAndSend(destination, request.getMessage());
//        return "Notification sent";
//    }

    // 获取通知信息的端点 (这个端点可以用于测试或其他需求)
    @GetMapping("/info")
    public Map<String, String> getNotificationInfo(@RequestParam String t) {
    	System.out.println("123");
        // 返回一些通知信息
        Map<String, String> response = new HashMap<>();
        response.put("message", "Notification info with parameter: " + t);
        return response;
    }
    
    // 获取用户的所有未读通知
    @GetMapping("/unread/{userId}")
    public List<Notification> getUnreadNotifications(@PathVariable Long userId) {
        return notificationService.getUnreadNotifications(userId);
    }

    // 标记通知为已读
    @PostMapping("/read/{notificationId}")
    public ResponseEntity<?> markAsRead(@PathVariable Long notificationId) {
        notificationService.markAsRead(notificationId);
        return ResponseEntity.ok("通知已标记为已读");
    }

    // 获取用户的所有通知
    @GetMapping("/all/{userId}")
    public List<Notification> getAllNotifications(@PathVariable Long userId) {
        return notificationService.getAllNotifications(userId);
    }
}
