package com.example.blog;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
	
	@Value("${cors.allowed.origins}")
	private String allowedOrigins;  // 此变量用于存储配置文件中的 CORS origins
	
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(allowedOrigins)
                //.allowedOrigins("http://localhost:3000")
                .allowedMethods("*") // 允許的方法
                .allowCredentials(true)
                .allowedHeaders("*");
    }


}
