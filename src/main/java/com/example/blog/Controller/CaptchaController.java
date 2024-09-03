package com.example.blog.Controller;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.Collections;
import java.util.Map;
import java.util.Random;

import javax.imageio.ImageIO;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.blog.Model.AccountVo;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/ac")
public class CaptchaController {

    public String getClientIp(HttpServletRequest request) {
        String header = request.getHeader("X-Forwarded-For");
        if (header == null || header.isEmpty() || "unknown".equalsIgnoreCase(header)) {
            header = request.getHeader("X-Real-IP");
        }
        if (header == null || header.isEmpty() || "unknown".equalsIgnoreCase(header)) {
            header = request.getRemoteAddr();
        }
        return header;
    }

    @GetMapping("/captcha")
    public void getCaptcha(HttpServletRequest request, HttpServletResponse response) throws IOException {

        String clientIpAddress = getClientIp(request);
        System.out.println("Client IP Address: " + clientIpAddress);

        int width = 160;
        int height = 40;
        char data[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".toCharArray();
        BufferedImage bufferedImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        Graphics g = bufferedImage.getGraphics();
        Random random = new Random();

        g.setColor(Color.WHITE);
        g.fillRect(0, 0, width, height);
        g.setFont(new Font("Arial", Font.BOLD, 30));

        String captcha = "";
        for (int i = 0; i < 6; i++) {
            captcha += data[random.nextInt(data.length)];
        }

        HttpSession session = request.getSession();
        System.out.println("Session ID: " + session.getId());
        session.setAttribute("captcha", captcha);
        g.setColor(Color.BLACK);
        g.drawString(captcha, 20, 30);
        g.dispose();

        response.setContentType("image/png");
        ImageIO.write(bufferedImage, "png", response.getOutputStream());
    }

    public ResponseEntity<Map<String, String>> validateCaptcha(@RequestBody AccountVo vo, HttpServletRequest request) {
        HttpSession session = request.getSession(); // 从 session 中获取生成的验证码
        String sessionCaptcha = (String) session.getAttribute("captcha");
        String inputCaptcha = vo.getCaptcha(); // 确保 AccountVo 包含 captcha 字段
        System.out.println("session is " + session);
        System.out.println("sessionCaptcha is " + sessionCaptcha);
        System.out.println("inputCaptcha is " + inputCaptcha);
        // 检查验证码是否匹配
        if (sessionCaptcha == null || !sessionCaptcha.equalsIgnoreCase(inputCaptcha)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Collections.singletonMap("message", "驗證碼不正確"));
        }

        // 验证通过后清除 session 中的验证码
        session.removeAttribute("captcha");


        // 继续处理其他逻辑，例如验证用户名和密码
        // ...
        return ResponseEntity.ok(Collections.singletonMap("message", "驗證碼正確"));
    }
}
