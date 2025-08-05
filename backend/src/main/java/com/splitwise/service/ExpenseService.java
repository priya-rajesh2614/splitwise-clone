package com.splitwise.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.splitwise.dto.ExpenseRequestDto;
import com.splitwise.dto.ExpenseResponceDto;
import com.splitwise.dto.ExpenseSplitDto;
import com.splitwise.dto.GroupMemberBalanceDto;
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
		expence.setGroup(group);
		expence.setPaidBy(user);

		Expense saveExpence = expensesRepo.save(expence);

		BigDecimal splitAmount = expenceRequestDto.getAmount()
				.divide(BigDecimal.valueOf(expenceRequestDto.getUserIds().size()), 2, RoundingMode.HALF_UP);

		List<ExpenseSplitDto> splitDetails = new ArrayList<>();

		for (Long userId : expenceRequestDto.getUserIds()) {
			Optional<User> optionalSplitUser = userRepo.findById(userId);

			if (optionalSplitUser.isEmpty()) {
				return ResponseEntity.badRequest()
						.body("Split user not found with ID: " + expenceRequestDto.getPaidBy());
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
		response.setGroupId(expense.getGroup().getId());
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

	public ResponseEntity<?> getGroupBalances(Long groupId) {

		Optional<Group> optionalGroup = groupRepo.findById(groupId);

		if (optionalGroup.isEmpty()) {
			return ResponseEntity.badRequest().body("Group not found with Id = " + groupId);
		}

		List<Expense> expenses = expensesRepo.findByGroup_Id(groupId);

		Map<Long, BigDecimal> paidAmountMap = new HashMap<>();
		Map<Long, BigDecimal> owedAmountMap = new HashMap<>();
		Map<Long, String> userIdNameMap = new HashMap<>();

		for (Expense expense : expenses) {
			Long paidById = expense.getPaidBy().getId();
			BigDecimal amount = expense.getAmount();
			paidAmountMap.put(paidById, paidAmountMap.getOrDefault(paidById, BigDecimal.ZERO).add(amount));
			userIdNameMap.put(paidById, expense.getPaidBy().getName());

			List<ExpenseSplit> splits = splitRepo.findByExpense(expense);
			int totalSplitUsers = splits.size();

			if (totalSplitUsers == 0) {
				continue;
			}

			BigDecimal perUserShare = amount.divide(BigDecimal.valueOf(totalSplitUsers), 2, RoundingMode.HALF_UP);

			for (ExpenseSplit split : splits) {
				Long userId = split.getUser().getId();
				owedAmountMap.put(userId, owedAmountMap.getOrDefault(userId, BigDecimal.ZERO).add(perUserShare));
				userIdNameMap.put(userId, split.getUser().getName());
			}
		}

		Set<Long> allUserIds = new HashSet<>();
		allUserIds.addAll(paidAmountMap.keySet());
		allUserIds.addAll(owedAmountMap.keySet());

		List<GroupMemberBalanceDto> result = new ArrayList<>();

		for (Long userId : allUserIds) {
			BigDecimal paid = paidAmountMap.getOrDefault(userId, BigDecimal.ZERO);
			BigDecimal owed = owedAmountMap.getOrDefault(userId, BigDecimal.ZERO);
			BigDecimal balance = paid.subtract(owed);
			result.add(new GroupMemberBalanceDto(userId, userIdNameMap.get(userId), balance));
		}

		return ResponseEntity.ok(result);
	}

}
