package com.splitwise.dto;

import java.math.BigDecimal;

public class ExpenseSplitDto {
	 private Long userId;
	    private String userName;
	    private BigDecimal amountOwed;
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
		public BigDecimal getAmountOwed() {
			return amountOwed;
		}
		public void setAmountOwed(BigDecimal amountOwed) {
			this.amountOwed = amountOwed;
		}
		

}
