package com.splitwise.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.splitwise.dto.UserDto;
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
	public ResponseEntity<?> createUser(@RequestBody UserDto userdto){
		 return userService.createdUser(userdto);
	}

}
