package com.example.blog;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;
import java.util.Optional;

import com.example.blog.Model.AccountVo;

public class JwtUtil {

    // 生成一个安全的密钥
    private static final Key SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    // 生成JWT token
    public static String generateToken(String username, String imageLink) {
        return Jwts.builder()
        		.setSubject(username)
        		.claim("imagelink", imageLink)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10小时过期
                .signWith(SECRET_KEY) // 修正了签名方式
                .compact();
    }

    // 提取Claims
    public static Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)  // 修正了密钥设置方法
                .build()  // 使用builder方法
                .parseClaimsJws(token)
                .getBody();
    }

    // 提取用户名
    public static String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }
    
    //提取使用者圖檔位置
    public static String extractImageLink(String token) {
        return (String) extractClaims(token).get("imagelink");
    }

    // 检查token是否过期
    public static boolean isTokenExpired(String token) {
        return extractClaims(token).getExpiration().before(new Date());
    }

    // 验证token是否有效
    public static boolean validateToken(String token, String username) {
        return username.equals(extractUsername(token)) && !isTokenExpired(token);
    }

	public static String generateToken(String username, Optional<AccountVo> byUsername) {
		// TODO Auto-generated method stub
		return null;
	}
}

