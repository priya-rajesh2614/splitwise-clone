package com.splitwise.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.splitwise.dto.CreateUserDto;
import com.splitwise.dto.LoginRequestDto;
import com.splitwise.dto.UserResponseDto;
import com.splitwise.entity.User;
import com.splitwise.service.UserService;

@RestController
@RequestMapping("/users")
public class UserController {
     
	private UserService userService;
	
	
	public UserController(UserService userService) {
		this.userService = userService;
		
	}

	@GetMapping
	public List<User> getAllUsers(){
		return userService.getAllUsers();
	}
	
	@PostMapping
	public ResponseEntity<?> createUser(@RequestBody CreateUserDto userdto){
		 return userService.createdUser(userdto);
	}
	
	
	 @PostMapping("/login")
	    public ResponseEntity<UserResponseDto> login(@RequestBody LoginRequestDto request) {
	        UserResponseDto user = userService.login(request);
	        if (user != null) {
	            return ResponseEntity.ok(user);
	        } else {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	        }
	    }

}
