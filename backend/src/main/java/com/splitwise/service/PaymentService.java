package com.splitwise.service;

import java.time.LocalDateTime;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.splitwise.dto.PaymentRequestDto;
import com.splitwise.dto.PaymentResponceDto;
import com.splitwise.entity.Payment;
import com.splitwise.repository.PaymentRepo;

@Service
public class PaymentService {

	private PaymentRepo paymentRepo;

	public PaymentService(PaymentRepo paymentRepo) {
		this.paymentRepo = paymentRepo;
	}

	public ResponseEntity<?> createPayment(PaymentRequestDto request) {

		Payment payment = new Payment();
		payment.setGroupId(request.getGroupId());
		payment.setFromUserId(request.getFromUserId());
		payment.setToUserId(request.getToUserId());
		payment.setAmount(request.getAmount());
		payment.setSettledAt(LocalDateTime.now());

		Payment saved = paymentRepo.save(payment);

		PaymentResponceDto response = new PaymentResponceDto();
		response.setId(saved.getId());
		response.setGroupId(saved.getGroupId());
		response.setFromUserId(saved.getFromUserId());
		response.setToUserId(saved.getToUserId());
		response.setAmount(saved.getAmount());
		response.setSettledAt(saved.getSettledAt());

		return ResponseEntity.ok(response);
	}

}
