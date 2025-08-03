package com.splitwise.dto;

import java.io.Serializable;
import java.util.Objects;

public class GroupMemberId implements Serializable {


	private static final long serialVersionUID = 1L;
	private Long group;
    private Long user;
    
    public GroupMemberId() {
    	super();
    }
    
	public GroupMemberId(Long groupId, Long userId) {
		super();
		this.group = groupId;
		this.user = userId;
	}

	@Override
	public int hashCode() {
		return Objects.hash(group, user);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		GroupMemberId other = (GroupMemberId) obj;
		return Objects.equals(group, other.group) && Objects.equals(user, other.user);
	}
	
	

   
}

