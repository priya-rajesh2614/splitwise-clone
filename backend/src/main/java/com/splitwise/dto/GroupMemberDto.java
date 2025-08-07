package com.splitwise.dto;

import java.util.List;

public class GroupMemberDto {
    private List<Long> userIds;

	public List<Long> getUserIds() {
		return userIds;
	}

	public void setUserIds(List<Long> userIds) {
		this.userIds = userIds;
	}

	public GroupMemberDto(List<Long> userIds) {
		this.userIds = userIds;
	}

    
}
