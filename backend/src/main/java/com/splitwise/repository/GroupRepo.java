package com.splitwise.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.splitwise.entity.Group;

public interface GroupRepo extends JpaRepository<Group,Long>{
	
	List<Group> findByCreatedBy_Id(Long userId);
	
	Optional<Group> findById(Long Id);
	
	@Query("SELECT gm.group FROM GroupMember gm WHERE gm.user.id = :userId")
	List<Group> findGroupsByUserId(@Param("userId") Long userId);

}
