package com.splitwise.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.splitwise.entity.Expense;

public interface ExpenseRepo extends JpaRepository<Expense,Long>{

	List<Expense> findByGroup_Id(Long groupId);


}
