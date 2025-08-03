package com.splitwise.entity;

import com.splitwise.dto.GroupMemberId;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@IdClass(GroupMemberId.class)
@Table(name="group_members")
public class GroupMember {
	
	@Id
	@ManyToOne
	@JoinColumn(name="group_id")
	private Group group;
	
	@Id
	@ManyToOne
	@JoinColumn(name="user_id")
	private User user;
	

    private java.time.LocalDateTime createdAt = java.time.LocalDateTime.now();


	public Group getGroup() {
		return group;
	}


	public void setGroup(Group group) {
		this.group = group;
	}


	public User getUser() {
		return user;
	}


	public void setUser(User user) {
		this.user = user;
	}


	public java.time.LocalDateTime getCreatedAt() {
		return createdAt;
	}


	public void setCreatedAt(java.time.LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
    

}
