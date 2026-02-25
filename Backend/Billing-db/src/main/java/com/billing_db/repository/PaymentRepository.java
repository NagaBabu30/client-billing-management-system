package com.billing_db.repository;

import com.billing_db.model.Payment;
import com.billing_db.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // ADMIN / ACCOUNTANT
    List<Payment> findByInvoice(Invoice invoice);

    // 👤 CLIENT – GET OWN PAYMENTS
    List<Payment> findByInvoiceClientUserUsername(String username);
}
