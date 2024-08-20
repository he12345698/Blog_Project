package com.example.blog;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.Resource;

@Service
public class EmailService {
	
	@Autowired
    private JavaMailSender mailSender = new JavaMailSenderImpl();
	
    public void sendResetPasswordEmail(AccountVo vo, String token) {
    	
        String resetLink = "http://niceblog.myvnc.com:81/reset-password/" + token;
        SimpleMailMessage message = new SimpleMailMessage();
        System.out.println("mailSender is " + mailSender);
        
        message.setTo(vo.getEmail());
        message.setSubject("重設密碼請求");
        message.setText("請點擊以下連結重設您的密碼:\n" + resetLink);
        System.out.println("Email is " + vo.getEmail());
        System.out.println("message is " + message);
        try {
            mailSender.send(message);
        } catch (MailException e) {
            // 記錄錯誤或回傳合適的響應
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }

}