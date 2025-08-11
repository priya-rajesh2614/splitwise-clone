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
import com.splitwise.dto.UserBalanceDto;
import com.splitwise.entity.Expense;
import com.splitwise.entity.ExpenseSplit;
import com.splitwise.entity.Group;
import com.splitwise.entity.Payment;
import com.splitwise.entity.User;
import com.splitwise.repository.ExpenseRepo;
import com.splitwise.repository.ExpenseSplitRepo;
import com.splitwise.repository.GroupRepo;
import com.splitwise.repository.PaymentRepo;
import com.splitwise.repository.UserRepo;

@Service
public class ExpenseService {

	private ExpenseRepo expensesRepo;

	private ExpenseSplitRepo splitRepo;

	private UserRepo userRepo;

	private GroupRepo groupRepo;
	
	private PaymentRepo paymentRepo;

	public ExpenseService(ExpenseRepo expencesRepo, ExpenseSplitRepo splitRepo, UserRepo userRepo,
			GroupRepo groupRepo, PaymentRepo paymentRepo) {
		this.expensesRepo = expencesRepo;
		this.splitRepo = splitRepo;
		this.userRepo = userRepo;
		this.groupRepo = groupRepo;
		this.paymentRepo = paymentRepo;
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
			
			BigDecimal owes = userId.equals(user.getId()) 
			        ? BigDecimal.ZERO 
			        : splitAmount;

			ExpenseSplit split = new ExpenseSplit();
			split.setExpense(saveExpence);
			split.setUser(splitUser);
			split.setAmountOwed(owes);

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

	        if (totalSplitUsers == 0) continue;

	        BigDecimal perUserShare = amount.divide(BigDecimal.valueOf(totalSplitUsers), 2, RoundingMode.HALF_UP);

	        for (ExpenseSplit split : splits) {
	            Long userId = split.getUser().getId();
	            owedAmountMap.put(userId, owedAmountMap.getOrDefault(userId, BigDecimal.ZERO).add(perUserShare));
	            userIdNameMap.put(userId, split.getUser().getName());
	        }
	    }

	    Map<Long, BigDecimal> balances = new HashMap<>();
	    Set<Long> allUserIds = new HashSet<>();
	    allUserIds.addAll(paidAmountMap.keySet());
	    allUserIds.addAll(owedAmountMap.keySet());

	    for (Long userId : allUserIds) {
	        BigDecimal paid = paidAmountMap.getOrDefault(userId, BigDecimal.ZERO);
	        BigDecimal owed = owedAmountMap.getOrDefault(userId, BigDecimal.ZERO);
	        balances.put(userId, paid.subtract(owed));
	    }

	    List<Payment> paymentsList = paymentRepo.findByGroupId(groupId);
	    for (Payment payment : paymentsList) {
	        Long fromUserId = payment.getFromUserId();
	        Long toUserId = payment.getToUserId();
	        BigDecimal amount = payment.getAmount();

	        balances.put(fromUserId, balances.getOrDefault(fromUserId, BigDecimal.ZERO).add(amount));

	        balances.put(toUserId, balances.getOrDefault(toUserId, BigDecimal.ZERO).subtract(amount));
	    }


	    List<UserBalanceDto> creditors = new ArrayList<>();
	    List<UserBalanceDto> debtors = new ArrayList<>();

	    for (Map.Entry<Long, BigDecimal> entry : balances.entrySet()) {
	        Long userId = entry.getKey();
	        BigDecimal balance = entry.getValue();

	        if (balance.compareTo(BigDecimal.ZERO) > 0) {
	            creditors.add(new UserBalanceDto(userId, userIdNameMap.get(userId), balance));
	        } else if (balance.compareTo(BigDecimal.ZERO) < 0) {
	            debtors.add(new UserBalanceDto(userId, userIdNameMap.get(userId), balance.abs()));
	        }
	    }

	    List<GroupMemberBalanceDto> payments = new ArrayList<>();
	    int i = 0, j = 0;

	    while (i < debtors.size() && j < creditors.size()) {
	        UserBalanceDto debtor = debtors.get(i);
	        UserBalanceDto creditor = creditors.get(j);

	        BigDecimal minAmount = debtor.getAmount().min(creditor.getAmount());

	        if (!debtor.getUserId().equals(creditor.getUserId())) {
	            payments.add(new GroupMemberBalanceDto(
	                debtor.getUserId(),
	                debtor.getName(),
	                minAmount,
	                creditor.getUserId(),
	                creditor.getName()
	            ));
	        }

	        debtor.setAmount(debtor.getAmount().subtract(minAmount));
	        creditor.setAmount(creditor.getAmount().subtract(minAmount));

	        if (debtor.getAmount().compareTo(BigDecimal.ZERO) == 0) i++;
	        if (creditor.getAmount().compareTo(BigDecimal.ZERO) == 0) j++;
	    }

	    return ResponseEntity.ok(payments);
	}


	public List<ExpenseResponceDto> getExpensesByGroupId(Long groupId) {
		List<Expense> expenses = expensesRepo.findByGroup_Id(groupId);

		List<ExpenseResponceDto> responseList = new ArrayList<>();

		for (Expense exp : expenses) {
			ExpenseResponceDto response = new ExpenseResponceDto();
			response.setExpenseId(exp.getId());
			response.setDescription(exp.getDescription());
			response.setAmount(exp.getAmount());
			response.setGroupId(exp.getGroup().getId());
			response.setPaidBy(exp.getPaidBy().getName());
			response.setCreatedAt(exp.getCreatedAt());

			List<ExpenseSplitDto> splitDetails = new ArrayList<>();

			List<ExpenseSplit> expenseSplits = splitRepo.findByExpense(exp);

			for (ExpenseSplit expenceSplit : expenseSplits) {

				ExpenseSplitDto splitDTO = new ExpenseSplitDto();
				splitDTO.setUserId(expenceSplit.getId());
				splitDTO.setUserName(expenceSplit.getUser().getName());
				splitDTO.setAmountOwed(expenceSplit.getAmountOwed());

				splitDetails.add(splitDTO);
			}

			response.setSplitDetails(splitDetails);

			responseList.add(response);
		}
		

		return responseList;
	}

}
