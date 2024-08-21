package com.example.blog;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }
    
    public EmailService() {
        this.mailSender = null;
		return;
    }

    public void sendResetPasswordEmail(AccountVo vo, String token) {
        String resetLink = "http://niceblog.myvnc.com:81/reset-password?token=" + token;
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(vo.getEmail());
        message.setSubject("重設密碼請求");
        message.setText("請點擊以下連結重設您的密碼:\n" + resetLink);

        try {
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }
}