package com.splitwise.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.splitwise.entity.Expense;
import com.splitwise.entity.ExpenseSplit;

public interface ExpenseSplitRepo extends JpaRepository<ExpenseSplit, Long> {
	
	List<ExpenseSplit> findByExpense(Expense expense);

}
