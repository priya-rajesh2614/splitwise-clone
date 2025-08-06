package com.splitwise.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.splitwise.entity.User;

public interface UserRepo extends JpaRepository<User,Long>{
	
	boolean existsByEmail(String email);

	Optional<User> findByEmail(String email);

}
