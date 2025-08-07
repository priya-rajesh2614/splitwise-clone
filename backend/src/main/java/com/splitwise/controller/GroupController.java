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
import com.splitwise.service.ExpenseService;
import com.splitwise.service.GroupService;

@RestController
@RequestMapping("/groups")
public class GroupController {
	private GroupService groupService;
	private ExpenseService expenseService;

	public GroupController(GroupService groupService, ExpenseService expenseService) {
		this.groupService = groupService;
		this.expenseService = expenseService;
	}

	@PostMapping
	public ResponseEntity<?> createGroup(@RequestBody GroupDto groupdto) throws BadRequestException {
		return groupService.createGroup(groupdto);
	}

	@GetMapping("/user/{userId}")
	public List<GroupResponseDto> getAllGroups(@PathVariable Long userId) {
		return groupService.getAllGroups(userId);
	}

	@PostMapping("/{groupId}/members")
	public ResponseEntity<?> addMembersToGroup(@PathVariable Long groupId, @RequestBody GroupMemberDto dto)
			throws BadRequestException {
		return groupService.addMembers(groupId, dto.getUserIds());
	}

	@GetMapping("/{groupId}/members")
	public ResponseEntity<?> listGroupMembers(@PathVariable Long groupId) {
		return groupService.getMembers(groupId);
	}

	@GetMapping("{groupId}/balances")
	public ResponseEntity<?> getGroupBalances(@PathVariable Long groupId) {
		return expenseService.getGroupBalances(groupId);
	}

	@GetMapping("/{groupId}")
	public ResponseEntity<?> getGroupById(@PathVariable Long groupId) {

		return groupService.getGroupById(groupId);
	}

}
