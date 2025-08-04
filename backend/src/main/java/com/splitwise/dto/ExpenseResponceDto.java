package com.splitwise.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class ExpenseResponceDto {

	private Long expenseId;
    private String description;
    private BigDecimal amount;
    private Long groupId;
    private String paidBy;
    private List<ExpenseSplitDto> splitDetails;
    private LocalDateTime createdAt;
    
	public Long getExpenseId() {
		return expenseId;
	}
	public void setExpenseId(Long expenseId) {
		this.expenseId = expenseId;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	
	public Long getGroupId() {
		return groupId;
	}
	public void setGroupId(Long groupId) {
		this.groupId = groupId;
	}
	

	
	
	public List<ExpenseSplitDto> getSplitDetails() {
		return splitDetails;
	}
	public void setSplitDetails(List<ExpenseSplitDto> splitDetails) {
		this.splitDetails = splitDetails;
	}
	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
	public BigDecimal getAmount() {
		return amount;
	}
	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}
	public String getPaidBy() {
		return paidBy;
	}
	public void setPaidBy(String paidBy) {
		this.paidBy = paidBy;
	}

}
