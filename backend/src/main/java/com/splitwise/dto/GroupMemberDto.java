package com.splitwise.dto;

public class GroupMemberDto {
    private Long userId;

    public GroupMemberDto() {
    }

    public GroupMemberDto(Long userId) {
        this.userId = userId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
