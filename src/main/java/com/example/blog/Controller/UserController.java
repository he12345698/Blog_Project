package com.example.blog.Controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.blog.JwtUtil;
import com.example.blog.Model.AccountVo;
import com.example.blog.Repository.AccountRepository;

@RestController
@RequestMapping("/api")
public class UserController {
	
	@Autowired
    private AccountRepository accountRepository;

	@GetMapping("/protected-endpoint")
	public ResponseEntity<Map<String, String>> getProtectedData(@RequestHeader(value = "Authorization", required = false) String authHeader) {
	    // 检查 Authorization 头是否存在
	    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
	        Map<String, String> responseBody = new HashMap<>();
	        responseBody.put("message", "缺少或无效的 Authorization 头");
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseBody);
	    }

	    try {
	        // 提取 token
	        String token = authHeader.replace("Bearer ", "").trim();
	        String username = JwtUtil.extractUsername(token);
	        Long id = JwtUtil.extractId(token);
	        String userImage = JwtUtil.extractImageLink(token);
	        String password = JwtUtil.extractPassword(token);
	        String email = JwtUtil.extractEmail(token);

	        // 检查 token 和 username 的有效性
	        if (username == null || id == null || !JwtUtil.validateToken(token, username)) {
	            Map<String, String> responseBody = new HashMap<>();
	            responseBody.put("message", "无效的令牌");
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseBody);
	        }

	        // 从数据库中获取用户信息
	        AccountVo user = accountRepository.findById(id).orElse(null);
	        System.out.println("user is " + user);
	        System.out.println("old username is " + username);
	        System.out.println("new username is " + user.getUsername());
	        if (user == null) {
	            Map<String, String> responseBody = new HashMap<>();
	            responseBody.put("message", "用户不存在");
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseBody);
	        }

	        // 检查 token 中的 username 是否与数据库中的一致
	        if (!username.equals(user.getUsername())) {
	            // 生成新的 token
	            String newToken = JwtUtil.generateToken(id,user.getUsername(),userImage,password,email);
	            
	            Map<String, String> responseBody = new HashMap<>();
	            responseBody.put("message", "用户名已更新，请使用新的令牌");
	            responseBody.put("token", newToken);
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseBody);
	        }

	        // 生成保护的数据
	        Map<String, String> responseBody = new HashMap<>();
	        responseBody.put("username", username);
	        responseBody.put("id", String.valueOf(id));
	        responseBody.put("userImage", userImage);
	        responseBody.put("password", password);
	        responseBody.put("email", email);
	        return ResponseEntity.ok(responseBody);

	    } catch (Exception e) {
	        // 捕获异常并返回错误信息
	        Map<String, String> responseBody = new HashMap<>();
	        responseBody.put("message", "服务器错误：" + e.getMessage());
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseBody);
	    }
	}

}
