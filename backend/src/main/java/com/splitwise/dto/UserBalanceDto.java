package com.splitwise.dto;

import java.math.BigDecimal;


public class UserBalanceDto {
	private Long userId;
    private String name;
    private BigDecimal amount;

    public UserBalanceDto(Long userId, String name, BigDecimal amount) {
        this.userId = userId;
        this.name = name;
        this.amount = amount;
    }

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public BigDecimal getAmount() {
		return amount;
	}

	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}
    
    
}