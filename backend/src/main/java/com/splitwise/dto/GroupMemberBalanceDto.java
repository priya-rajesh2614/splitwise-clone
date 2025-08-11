package com.splitwise.dto;

import java.math.BigDecimal;

public class GroupMemberBalanceDto {

	private Long userId;
	private String userName;
	private BigDecimal balance;
	private Long toUserId;
	private String toUserName;

	public GroupMemberBalanceDto(Long userId, String userName, BigDecimal balance, Long toUserId, String toUserName) {
		this.userId = userId;
		this.userName = userName;
		this.balance = balance;
		this.toUserId = toUserId;
		this.toUserName = toUserName;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public BigDecimal getBalance() {
		return balance;
	}

	public void setBalance(BigDecimal balance) {
		this.balance = balance;
	}

	public Long getToUserId() {
		return toUserId;
	}

	public void setToUserId(Long toUserId) {
		this.toUserId = toUserId;
	}

	public String getToUserName() {
		return toUserName;
	}

	public void setToUserName(String toUserName) {
		this.toUserName = toUserName;
	}

	
}
