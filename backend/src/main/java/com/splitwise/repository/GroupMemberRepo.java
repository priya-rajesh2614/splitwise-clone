package com.splitwise.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.splitwise.dto.GroupMemberId;
import com.splitwise.entity.Group;
import com.splitwise.entity.GroupMember;

public interface GroupMemberRepo extends JpaRepository<GroupMember, GroupMemberId>{
	
	List<GroupMember> findByGroup(Group group);


}
