package com.example.blog;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class Dao2 {
	
	private static final String jdbcUrl = "jdbc:mysql://192.168.50.69:3306/blog";
    private static final String id = "Edshow";
    private static final String paswd = "He0958955565";
	
	static {
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public Connection getConnection() throws SQLException {
		return DriverManager.getConnection(jdbcUrl,id,paswd);
	}
	
//	@Value("${jdbc.id}")
//	String id;
//	@Value("${jdbc.paswd}")
//	String paswd;
//	@Value("${jdbcurl}")
//	String jdbcUrl;
	
//	public String getId() {
//		return id;
//	}
//	public void setId(String id) {
//		this.id = id;
//	}
//	public String getPaswd() {
//		return paswd;
//	}
//	public void setPaswd(String paswd) {
//		this.paswd = paswd;
//	}
//	public String getJdbcUrl() {
//		return jdbcUrl;
//	}
//	public void setJdbcUrl(String jdbcUrl) {
//		this.jdbcUrl = jdbcUrl;
//	}
}
