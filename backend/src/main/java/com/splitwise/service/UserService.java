package com.splitwise.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.splitwise.dto.CreateUserDto;
import com.splitwise.entity.User;
import com.splitwise.repository.UserRepo;

@Service
public class UserService {
	
	private UserRepo userRepo;
	private PasswordEncoder passwordEncoder;

	public UserService(UserRepo userRepo, PasswordEncoder passwordEncoder) {
		
		this.userRepo = userRepo;
		this.passwordEncoder = passwordEncoder;
	}

	public List<User> getAllUsers() {
		return userRepo.findAll();
	}

	public ResponseEntity<?> createdUser(CreateUserDto userdto) {
		 if (userRepo.existsByEmail(userdto.getEmail())) {
	            return ResponseEntity
	                    .status(HttpStatus.BAD_REQUEST)
	                    .body("Email already exists");
	        }

	        User user = new User();
	        user.setName(userdto.getName());
	        user.setEmail(userdto.getEmail());
	        user.setPassword(passwordEncoder.encode(userdto.getPassword())); 

	        User savedUser = userRepo.save(user);

	        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
	}

}
