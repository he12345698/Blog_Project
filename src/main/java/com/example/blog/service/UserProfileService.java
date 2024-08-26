package com.example.blog.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.blog.Model.AccountVo;
import com.example.blog.repository.UserProfileRepository;

@Service
public class UserProfileService {

    @Autowired
    private UserProfileRepository userProfileRepository;

    public boolean updateUsername(String currentUsername, String newUsername) {
        int rowsAffected = userProfileRepository.updateUsername(currentUsername, newUsername);
        return rowsAffected > 0;// 至少有修改一行
    }

    public boolean updateEmail(String username, String newEmail) {
        int rowsAffected = userProfileRepository.updateEmail(username, newEmail);
        return rowsAffected > 0;
    }

    public AccountVo getUserByUsername(String username){
        return userProfileRepository.findByUsername(username);
    }
}
