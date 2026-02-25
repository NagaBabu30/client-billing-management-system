package com.billing_db.service;

import com.billing_db.dto.payment.PaymentRequestDTO;
import com.billing_db.dto.payment.PaymentResponseDTO;
import com.billing_db.model.*;
import com.billing_db.repository.InvoiceRepository;
import com.billing_db.repository.PaymentRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;

    public PaymentService(PaymentRepository paymentRepository,
                          InvoiceRepository invoiceRepository) {
        this.paymentRepository = paymentRepository;
        this.invoiceRepository = invoiceRepository;
    }

    /* =====================================================
       CLIENT
       ===================================================== */

    // 👤 CLIENT – PAY OWN INVOICE
    public PaymentResponseDTO makePaymentForClient(
            PaymentRequestDTO request,
            String username) {

        Invoice invoice = invoiceRepository
                .findByIdAndClientUserUsername(
                        request.getInvoiceId(),
                        username
                )
                .orElseThrow(() ->
                        new RuntimeException("Invoice not found"));

        return processPayment(invoice, request);
    }

    // 📄 CLIENT – VIEW OWN PAYMENTS
    public List<PaymentResponseDTO> getPaymentsByUsername(String username) {

        return paymentRepository
                .findByInvoiceClientUserUsername(username)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    /* =====================================================
       ADMIN / ACCOUNTANT
       ===================================================== */

    // 💰 ADMIN / ACCOUNTANT – PAY ANY INVOICE
    public PaymentResponseDTO makePayment(
            PaymentRequestDTO request) {

        Invoice invoice = invoiceRepository
                .findById(request.getInvoiceId())
                .orElseThrow(() ->
                        new RuntimeException("Invoice not found"));

        return processPayment(invoice, request);
    }

    // 📄 ADMIN / ACCOUNTANT – VIEW ALL PAYMENTS
    public List<PaymentResponseDTO> getAllPayments() {

        return paymentRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    /* =====================================================
       COMMON PAYMENT LOGIC (CORE)
       ===================================================== */

    private PaymentResponseDTO processPayment(
            Invoice invoice,
            PaymentRequestDTO request) {

        if (request.getAmount() <= 0) {
            throw new RuntimeException(
                    "Payment amount must be greater than zero");
        }

        double total = invoice.getTotalAmount();
        double paid = invoice.getPaidAmount();
        double balance = total - paid;

        if (balance <= 0) {
            throw new RuntimeException(
                    "Invoice already fully paid");
        }

        if (request.getAmount() > balance) {
            throw new RuntimeException(
                    "Payment exceeds invoice balance");
        }

        // 💰 CREATE PAYMENT
        Payment payment = new Payment();
        payment.setInvoice(invoice);
        payment.setAmount(request.getAmount());
        payment.setPaymentMode(request.getPaymentMode());
        payment.setPaymentDate(LocalDate.now());
        payment.setStatus(PaymentStatus.SUCCESS);

        paymentRepository.save(payment);

        // 🔁 UPDATE INVOICE
        double newPaid = paid + request.getAmount();
        double newBalance = total - newPaid;

        invoice.setPaidAmount(newPaid);
        invoice.setBalance(newBalance);

        if (newBalance == 0) {
            invoice.setStatus(InvoiceStatus.PAID);
        } else {
            invoice.setStatus(InvoiceStatus.PARTIAL);
        }

        invoiceRepository.save(invoice);

        return mapToResponse(payment);
    }

    /* =====================================================
       ENTITY → DTO MAPPER
       ===================================================== */

    private PaymentResponseDTO mapToResponse(
            Payment payment) {

        PaymentResponseDTO dto =
                new PaymentResponseDTO();

        dto.setId(payment.getId());
        dto.setInvoiceId(
                payment.getInvoice().getId());
        dto.setAmount(payment.getAmount());
        dto.setPaymentMode(
                payment.getPaymentMode().name());
        dto.setStatus(
                payment.getStatus().name());
        dto.setPaymentDate(
                payment.getPaymentDate());

        return dto;
    }
}


