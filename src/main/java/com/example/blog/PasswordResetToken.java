package com.example.blog;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class PasswordResetToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private AccountVo vo;

    private String token;

    private LocalDateTime expiryDate;

    public PasswordResetToken() {}

    public PasswordResetToken(AccountVo vo, String token) {
        this.vo = vo;
        this.token = token;
        this.expiryDate = LocalDateTime.now().plusHours(1); // Token expires in 1 hour
    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public AccountVo getVo() {
		return vo;
	}

	public void setVo(AccountVo vo) {
		this.vo = vo;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public LocalDateTime getExpiryDate() {
		return expiryDate;
	}

	public void setExpiryDate(LocalDateTime expiryDate) {
		this.expiryDate = expiryDate;
	}
    
}

