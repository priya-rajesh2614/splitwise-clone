package com.splitwise.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.splitwise.entity.Group;

public interface GroupRepo extends JpaRepository<Group,Long>{
	
	List<Group> findByCreatedBy_Id(Long userId);
	
	Optional<Group> findById(Long Id);

}
