package com.example.blog;


import org.springframework.context.annotation.Bean;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class AccountVo {
	
	@Id
	String username;
	
	String password;
	String email;
	String imagelink;
	
	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
	
	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}
	
	public String getImagelink() {
		return imagelink;
	}

	public void setImagelink(String imagelink) {
		this.imagelink = imagelink;
	}
	
	@Override
	public String toString() {
		return "PersonVo [id = " + username + ", paswd = " + password + ", email = " + email + "]" + "\n";
	}
	
	
	
	
	
}
