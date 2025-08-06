package com.splitwise.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.splitwise.dto.GetUserDto;
import com.splitwise.dto.GroupDto;
import com.splitwise.dto.GroupMemberId;
import com.splitwise.dto.GroupResponseDto;
import com.splitwise.entity.Group;
import com.splitwise.entity.GroupMember;
import com.splitwise.entity.User;
import com.splitwise.repository.GroupMemberRepo;
import com.splitwise.repository.GroupRepo;
import com.splitwise.repository.UserRepo;

@Service
public class GroupService {

	private GroupRepo groupRepo;
	private UserRepo userRepo;
	private GroupMemberRepo groupMemberRepo;

	public GroupService(GroupRepo groupRepo, UserRepo userRepo, GroupMemberRepo groupMemberRepo) {
		this.groupRepo = groupRepo;
		this.groupMemberRepo = groupMemberRepo;
		this.userRepo = userRepo;
	}

	public ResponseEntity<?> createGroup(GroupDto groupdto) throws BadRequestException {

		Optional<User> optionalUser = userRepo.findById(groupdto.getCreatedBy());

		if (optionalUser.isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User not found");
		}
		
		User user = optionalUser.get();

		Group group = new Group();
		group.setName(groupdto.getName());
		group.setCreatedBy(user);

		Group savedGroup = groupRepo.save(group);

		GroupResponseDto response = new GroupResponseDto(savedGroup.getId(), savedGroup.getName(),
				savedGroup.getCreatedBy().getName(), savedGroup.getCreatedAt());

		return ResponseEntity.status(HttpStatus.CREATED).body(response);

	}

	public List<GroupResponseDto> getAllGroups(Long userId) {

		List<Group> groupList = groupRepo.findByCreatedBy_Id(userId);

		List<GroupResponseDto> groupResponseList = new ArrayList<>();

		for (Group group : groupList) {
			GroupResponseDto response = new GroupResponseDto(group.getId(), group.getName(),
					group.getCreatedBy().getName(), group.getCreatedAt());
			groupResponseList.add(response);
		}

		return groupResponseList;

	}

	public ResponseEntity<?> addMember(Long groupId, Long userId) throws BadRequestException {

		Optional<Group> optionalGroup = groupRepo.findById(groupId);
		Optional<User> optionalUser = userRepo.findById(userId);

		if (optionalGroup.isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Group not found");
		}

		if (optionalUser.isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User not found");
		}

		Group group = optionalGroup.get();
		User user = optionalUser.get();

		GroupMemberId id = new GroupMemberId(groupId, userId);

		if (groupMemberRepo.existsById(id)) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User already in group");
		}

		GroupMember member = new GroupMember();
		member.setGroup(group);
		member.setUser(user);
		member.setCreatedAt(LocalDateTime.now());

		groupMemberRepo.save(member);

		return ResponseEntity.ok("User added to group successfully");
	}

	public ResponseEntity<?> getMembers(Long groupId) {
		
		Optional<Group> optionalGroup = groupRepo.findById(groupId);

		if (optionalGroup.isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Group not found");
		}

	    List<GroupMember> members = groupMemberRepo.findByGroup(optionalGroup.get());
	    
	    List<GetUserDto> userDTOs = new ArrayList<>();
	    for (GroupMember member : members) {
	        User user = member.getUser();
	        GetUserDto dto = new GetUserDto(user.getId(), user.getName(), user.getEmail());
	        userDTOs.add(dto);
	    }

	    return ResponseEntity.ok(userDTOs);
	}

}
