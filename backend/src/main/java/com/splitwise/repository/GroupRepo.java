package com.splitwise.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.splitwise.entity.Group;

public interface GroupRepo extends JpaRepository<Group,Long>{

}
