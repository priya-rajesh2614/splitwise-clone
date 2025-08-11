package com.splitwise.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.splitwise.dto.PaymentRequestDto;
import com.splitwise.service.PaymentService;

@RestController
@RequestMapping("/payments")
public class PaymentController {

	
	private PaymentService paymentService;

	public PaymentController(PaymentService paymentService) {
		this.paymentService = paymentService;
	
	}
	
	
	@PostMapping
	public ResponseEntity<?> createPayment(@RequestBody PaymentRequestDto request){
		return paymentService.createPayment(request);
	}
}
