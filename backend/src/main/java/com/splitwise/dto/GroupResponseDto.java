package com.splitwise.dto;

import java.time.LocalDateTime;

public class GroupResponseDto {
	private Long id;
	private String name;
	private String createdBy;
	private LocalDateTime createdAt;
  
	 public GroupResponseDto(Long id, String name, String createdBy,LocalDateTime createdAt) {
	        this.id = id;
	        this.name = name;
	        this.createdBy = createdBy;
	        this.createdAt=createdAt;
	}

	 public GroupResponseDto() {
		// TODO Auto-generated constructor stub
	}

	 public Long getId() {
		 return id;
	 }

	 public void setId(Long id) {
		 this.id = id;
	 }

	 public String getName() {
		 return name;
	 }

	 public void setName(String name) {
		 this.name = name;
	 }

	 public String getCreatedBy() {
		 return createdBy;
	 }

	 public void setCreatedBy(String createdBy) {
		 this.createdBy = createdBy;
	 }

	 public LocalDateTime getCreatedAt() {
		 return createdAt;
	 }

	 public void setCreatedAt(LocalDateTime createdAt) {
		 this.createdAt = createdAt;
	 }
	 
	 

}
