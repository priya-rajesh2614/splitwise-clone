package com.splitwise.controller;

import java.util.List;

import org.apache.coyote.BadRequestException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.splitwise.dto.GroupDto;
import com.splitwise.dto.GroupMemberDto;
import com.splitwise.dto.GroupResponseDto;
import com.splitwise.service.GroupService;


@RestController
@RequestMapping("/groups")
public class GroupController {
	private GroupService groupService;

	public GroupController(GroupService groupService) {
		this.groupService = groupService;
	}
	
	@PostMapping
	public ResponseEntity<?> createGroup(@RequestBody GroupDto groupdto) throws BadRequestException{
		return groupService.createGroup(groupdto);
	}
	
	@GetMapping
	public List<GroupResponseDto> getAllGroups(){
		return groupService.getAllGroups();
	}
	
	@PostMapping("/{groupId}/members")
    public ResponseEntity<?> addMemberToGroup(@PathVariable Long groupId, @RequestBody GroupMemberDto dto) throws BadRequestException {
        return groupService.addMember(groupId, dto.getUserId());
    }
	
	@GetMapping("/{groupId}/members")
    public ResponseEntity<?> listGroupMembers(@PathVariable Long groupId) {
		return groupService.getMembers(groupId);
    }

	

}
