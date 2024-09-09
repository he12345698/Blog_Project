package com.example.blog.Model;

import java.time.LocalDateTime;

import jakarta.persistence.Table;
import org.springframework.context.annotation.Bean;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "account_vo")


@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class AccountVo {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // 新增一个唯一的ID欄位

	@Column(unique = true)
	private String username;
	
	private String password;
	private String email;
	private String imagelink;
	private String captcha;
	
	@Column(name = "created_date")
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdDate;

	@Column(name = "last_login_date")
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime lastLoginDate;
	
	@Column(name = "login_attempts")
    private Integer loginAttempts = 0;

    @Column(name = "account_locked")
    private Boolean accountLocked = false;
	
	@Column(name = "is_verified", nullable = false)
    private Boolean isVerified = false;

    @Column(name = "verification_token", length = 255)
    private String verificationToken;

    @Column(name = "token_expiration")
    private LocalDateTime tokenExpiration;
    
    public AccountVo(LocalDateTime acCd, LocalDateTime acLld) {
    	this.createdDate = createdDate;
    	this.lastLoginDate = lastLoginDate;
    	
	}
    
    public AccountVo() {
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public LocalDateTime getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(LocalDateTime createdDate) {
		this.createdDate = createdDate;
	}

	public LocalDateTime getLastLoginDate() {
		return lastLoginDate;
	}

	public void setLastLoginDate(LocalDateTime lastLoginDate) {
		this.lastLoginDate = lastLoginDate;
	}
	
	public Boolean getAccountLocked() {
		return accountLocked;
	}

	public void setAccountLocked(Boolean accountLocked) {
		this.accountLocked = accountLocked;
	}

	public Integer getLoginAttempts() {
		return loginAttempts;
	}

	public void setLoginAttempts(Integer loginAttempts) {
		this.loginAttempts = loginAttempts;
	}

	public Boolean getIsVerified() {
		return isVerified;
	}

	public void setIsVerified(Boolean isVerified) {
		this.isVerified = isVerified;
	}

	public String getVerificationToken() {
		return verificationToken;
	}

	public void setVerificationToken(String verificationToken) {
		this.verificationToken = verificationToken;
	}

	public LocalDateTime getTokenExpiration() {
		return tokenExpiration;
	}

	public void setTokenExpiration(LocalDateTime tokenExpiration) {
		this.tokenExpiration = tokenExpiration;
	}

	public String getCaptcha() {
		return captcha;
	}

	public void setCaptcha(String captcha) {
		this.captcha = captcha;
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
	
	public String getImagelink() {
		return imagelink;
	}

	public void setImagelink(String imagelink) {
		this.imagelink = imagelink;
	}
	
	@Override
	public String toString() {
		return "PersonVo [id = " + username + ", paswd = " + password + ", email = " + email + ", CreatedDate = " + createdDate + ", LastLoginDate = " + lastLoginDate + "]" + "\n";
	}

	public boolean isPresent() {
		// TODO Auto-generated method stub
		return false;
	}

	public AccountVo get() {
		// TODO Auto-generated method stub
		return null;
	}
	

}
