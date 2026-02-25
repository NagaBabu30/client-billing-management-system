package com.billing_db.controller.client;

import com.billing_db.dto.payment.PaymentRequestDTO;
import com.billing_db.dto.payment.PaymentResponseDTO;
import com.billing_db.service.PaymentService;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/client/payments")
@CrossOrigin
public class ClientPaymentController {

    private final PaymentService paymentService;

    public ClientPaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // 💰 PAY OWN INVOICE
    @PostMapping
    public PaymentResponseDTO makePayment(
            @RequestBody PaymentRequestDTO request,
            Authentication auth) {

        return paymentService.makePaymentForClient(
                request,
                auth.getName()
        );
    }

    // 📄 VIEW OWN PAYMENTS
    @GetMapping
    public List<PaymentResponseDTO> getMyPayments(
            Authentication auth) {

        return paymentService
                .getPaymentsByUsername(auth.getName());
    }
}


