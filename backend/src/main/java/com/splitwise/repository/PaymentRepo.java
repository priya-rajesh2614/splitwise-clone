package com.splitwise.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.splitwise.entity.Payment;

public interface PaymentRepo extends JpaRepository<Payment, Long> {

}
