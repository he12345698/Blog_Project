package com.example.blog.Service;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.example.blog.Model.AccountVo;
import com.example.blog.Model.ArticleVo;
import com.example.blog.Model.Notification;
import com.example.blog.Repository.AccountRepository;
import com.example.blog.Repository.ArticleRepository;
import com.example.blog.Repository.NotificationRepository;

import jakarta.transaction.Transactional;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    @Autowired
    private AccountService accountService;
    
    @Autowired
    private ArticleService articleService;
    
    @Autowired
    public NotificationService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

//    @Transactional
//    public void createNotification(Long articleId, Long userId) {
//        ArticleVo article = articleService.getArticleById1(articleId);
//        AccountVo user = accountService.getAccountById(userId);
//        // 創建通知邏輯
//        String destination = "/topic/notifications/" + user.getId();
//        String notificationMessage = "有人覺得你的文章 '" + article.getTitle() + "' 很讚！";
//        // 發送實時通知
//        messagingTemplate.convertAndSend(destination, notificationMessage);
//    }
    
    // 创建新的通知
    public Notification createArticleNotification(AccountVo user, ArticleVo article) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setArticle(article);
        String destination = "/topic/notifications/" + articleRepository.findByAuthorId(article.getAuthorId()).get(0).getAuthorId();
        System.out.printf("article is ",articleRepository.findByAuthorId(article.getAuthorId()).get(0).getAuthorId());
	    String notificationMessage = "有人覺得你的文章 '" + article.getTitle() + "' 很讚！";
	    notification.setContent(notificationMessage);
	      // 發送實時通知
	    messagingTemplate.convertAndSend(destination, notificationMessage);
        return notificationRepository.save(notification);
    }
    
    // 获取用户的所有未读通知
    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndIsReadFalse(userId);
    }
    
    // 将通知标记为已读
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId).orElseThrow(() -> new RuntimeException("通知不存在"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }
    
    // 获取用户的所有通知
    public List<Notification> getAllNotifications(Long userId) {
        return notificationRepository.findByUserId(userId);
    }
}

