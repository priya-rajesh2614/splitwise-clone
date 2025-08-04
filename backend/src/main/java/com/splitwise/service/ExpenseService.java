package com.splitwise.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.splitwise.dto.ExpenseRequestDto;
import com.splitwise.dto.ExpenseResponceDto;
import com.splitwise.dto.ExpenseSplitDto;
import com.splitwise.entity.Expense;
import com.splitwise.entity.ExpenseSplit;
import com.splitwise.entity.Group;
import com.splitwise.entity.User;
import com.splitwise.repository.ExpenseRepo;
import com.splitwise.repository.ExpenseSplitRepo;
import com.splitwise.repository.GroupRepo;
import com.splitwise.repository.UserRepo;

@Service
public class ExpenseService {

	private ExpenseRepo expensesRepo;

	private ExpenseSplitRepo splitRepo;

	private UserRepo userRepo;

	private GroupRepo groupRepo;

	public ExpenseService(ExpenseRepo expencesRepo, ExpenseSplitRepo splitRepo, UserRepo userRepo,
			GroupRepo groupRepo) {
		this.expensesRepo = expencesRepo;
		this.splitRepo = splitRepo;
		this.userRepo = userRepo;
		this.groupRepo = groupRepo;
	}

	public ResponseEntity<?> createExpence(ExpenseRequestDto expenceRequestDto) {

		Optional<Group> optionalGroup = groupRepo.findById(expenceRequestDto.getGroupId());

		if (optionalGroup.isEmpty()) {
			return ResponseEntity.badRequest().body("Group not found with ID: " + expenceRequestDto.getGroupId());
		}
		Group group = optionalGroup.get();

		Optional<User> optionalUser = userRepo.findById(expenceRequestDto.getPaidBy());

		if (optionalUser.isEmpty()) {
			return ResponseEntity.badRequest().body("User not found with ID: " + expenceRequestDto.getPaidBy());
		}
		User user = optionalUser.get();
		Expense expence = new Expense();
		expence.setDescription(expenceRequestDto.getDescription());
		expence.setAmount(expenceRequestDto.getAmount());
		expence.setGroupId(group);
		expence.setPaidBy(user);

		Expense saveExpence = expensesRepo.save(expence);

		BigDecimal splitAmount = expenceRequestDto.getAmount()
				.divide(BigDecimal.valueOf(expenceRequestDto.getUserIds().size()), 2, BigDecimal.ROUND_HALF_UP);

		List<ExpenseSplitDto> splitDetails = new ArrayList<>();

		for (Long userId : expenceRequestDto.getUserIds()) {
			Optional<User> optionalSplitUser = userRepo.findById(userId);
			
			if (optionalSplitUser.isEmpty()) {
				return ResponseEntity.badRequest().body("Split user not found with ID: " + expenceRequestDto.getPaidBy());
			}

			User splitUser = optionalSplitUser.get();
			
			ExpenseSplit split = new ExpenseSplit();
			split.setExpense(saveExpence);
			split.setUser(splitUser);
			split.setAmountOwed(splitAmount);

			splitRepo.save(split);

			ExpenseSplitDto splitDTO = new ExpenseSplitDto();
			splitDTO.setUserId(splitUser.getId());
			splitDTO.setUserName(splitUser.getName());
			splitDTO.setAmountOwed(splitAmount);

			splitDetails.add(splitDTO);
		}

		ExpenseResponceDto response = new ExpenseResponceDto();
		response.setExpenseId(saveExpence.getId());
		response.setDescription(saveExpence.getDescription());
		response.setAmount(saveExpence.getAmount());
		response.setGroupId(group.getId());
		response.setPaidBy(user.getName());
		response.setCreatedAt(saveExpence.getCreatedAt());
		response.setSplitDetails(splitDetails);

		return ResponseEntity.ok(response);

	}

	public ResponseEntity<?> getExpense(Long expenseId) {

		Optional<Expense> optionalExpense = expensesRepo.findById(expenseId);

		if (optionalExpense.isEmpty()) {
			return ResponseEntity.badRequest().body("Expense not found with ID: " + expenseId);
		}

		Expense expense = optionalExpense.get();
		
		List<ExpenseSplit> expenseSplits = splitRepo.findByExpense(expense);

		ExpenseResponceDto response = new ExpenseResponceDto();
		response.setExpenseId(expense.getId());
		response.setDescription(expense.getDescription());
		response.setAmount(expense.getAmount());
		response.setGroupId(expense.getGroupId().getId());
		response.setPaidBy(expense.getPaidBy().getName());
		response.setCreatedAt(expense.getCreatedAt());
		
		List<ExpenseSplitDto> splitDetails = new ArrayList<>();
		
		for (ExpenseSplit expenceSplit : expenseSplits) {
			
			ExpenseSplitDto splitDTO = new ExpenseSplitDto();
			splitDTO.setUserId(expenceSplit.getId());
			splitDTO.setUserName(expenceSplit.getUser().getName());
			splitDTO.setAmountOwed(expenceSplit.getAmountOwed());

			splitDetails.add(splitDTO);
		}
		
		response.setSplitDetails(splitDetails);

		return ResponseEntity.ok(response);

	}

}
