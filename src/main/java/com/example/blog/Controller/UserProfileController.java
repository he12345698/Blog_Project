package com.example.blog.Controller;

import org.hibernate.mapping.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.blog.AccountVo;
import com.example.blog.Service.UserService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
// @CrossOrigin(origins = "http://niceblog.myvnc.com:81")
@CrossOrigin(origins = "localhost:3000")
@RequestMapping("/api/userProfile")
public class UserProfileController {

    @Autowired
    UserService userService;

    @PostMapping("/by-username/{username}")
    public ResponseEntity<Map> postMethodName(@RequestBody String entity) {
        //TODO: process POST request
        
        return entity;
    }
    
}
