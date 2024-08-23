package com.example.blog;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.Random;

import javax.imageio.ImageIO;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
        session.setAttribute("captcha", captcha);
//        request.getSession().setAttribute("captcha", captcha);
        System.out.println("set in session captcha is " + session.getAttribute("captcha"));
        String sessionId = session.getId();
        System.out.println("Session ID: " + sessionId);
        g.setColor(Color.BLACK);
        g.drawString(captcha, 20, 30);

        g.dispose();

        response.setContentType("image/png");
        ImageIO.write(bufferedImage, "png", response.getOutputStream());
    }
}

