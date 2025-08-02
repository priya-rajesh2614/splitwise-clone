package com.splitwise.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.splitwise.entity.User;

public interface UserRepo extends JpaRepository<User,Long>{
	
	boolean existsByEmail(String email);

}
