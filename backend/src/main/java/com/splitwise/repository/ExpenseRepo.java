package com.splitwise.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.splitwise.entity.Expense;

public interface ExpenseRepo extends JpaRepository<Expense,Long>{

}
