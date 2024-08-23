package com.example.blog.Model;

import java.time.LocalDateTime;

public class AccountVo {
	
	String username;
	String password;
	String email;
	LocalDateTime created_date;
	LocalDateTime last_login_date;
	

	public LocalDateTime getCreated_date() {
		return created_date;
	}

	public void setCreated_date(LocalDateTime created_date) {
		this.created_date = created_date;
	}

	public LocalDateTime getLast_login_date() {
		return last_login_date;
	}

	public void setLast_login_date(LocalDateTime last_login_date) {
		this.last_login_date = last_login_date;
	}

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
	
	@Override
	public String toString() {
		return "PersonVo [id = " + username + ", paswd = " + password + ", email = " + email + "]" + "\n";
	}
	
	
	
	
	
}
