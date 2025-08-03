package com.splitwise.dto;

public class GroupMemberDTO {
    private Long userId;

    public GroupMemberDTO() {
    }

    public GroupMemberDTO(Long userId) {
        this.userId = userId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
