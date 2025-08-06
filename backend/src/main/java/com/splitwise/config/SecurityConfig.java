package com.splitwise.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
	
	 	@Bean
	    PasswordEncoder passwordEncoder() { 
	        return new BCryptPasswordEncoder();
	    }
	 	
	 	 @Bean
	     SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
	         http
	             .csrf(csrf -> csrf.disable())
	             .authorizeHttpRequests(auth -> auth
	                 .anyRequest().permitAll()
	             )
	             .httpBasic(Customizer.withDefaults());

	         return http.build();
	     }
	 	 

	     @Bean
	     public WebMvcConfigurer corsConfigurer() {
	         return new WebMvcConfigurer() {
	             @Override
	             public void addCorsMappings(CorsRegistry registry) {
	                 registry.addMapping("/**")
	                         .allowedOrigins("http://localhost:5173")
	                         .allowedMethods("GET", "POST", "PUT", "DELETE")
	                         .allowedHeaders("*");
	             }
	         };
	     }

}
