package com.splitwise.dto;

import java.math.BigDecimal;
import java.util.List;

public class ExpenseRequestDto {
	private String description;
    private BigDecimal amount;
    private Long groupId;
    private Long paidBy;
    private List<Long> userIds;
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	
	public BigDecimal getAmount() {
		return amount;
	}
	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}
	public Long getGroupId() {
		return groupId;
	}
	public void setGroupId(Long groupId) {
		this.groupId = groupId;
	}
	public Long getPaidBy() {
		return paidBy;
	}
	public void setPaidBy(Long paidBy) {
		this.paidBy = paidBy;
	}
	public List<Long> getUserIds() {
		return userIds;
	}
	public void setUserIds(List<Long> userIds) {
		this.userIds = userIds;
	}
    
}
