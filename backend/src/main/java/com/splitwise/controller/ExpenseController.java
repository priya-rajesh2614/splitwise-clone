package com.splitwise.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.splitwise.dto.ExpenseRequestDto;
import com.splitwise.service.ExpenseService;

@RestController
@RequestMapping("/expenses")
public class ExpenseController {
	
	private ExpenseService expenseService;

	
	
	public ExpenseController(ExpenseService expenseService) {
		this.expenseService = expenseService;
	}



	@PostMapping
	public ResponseEntity<?> createExpence(@RequestBody ExpenseRequestDto expenceRequestDto){
		return expenseService.createExpence(expenceRequestDto);
	}
		
	
	@GetMapping("/{expenseId}")	
	public ResponseEntity<?> getExpense(@PathVariable Long expenseId){
		return expenseService.getExpense(expenseId);
	}
	
}
