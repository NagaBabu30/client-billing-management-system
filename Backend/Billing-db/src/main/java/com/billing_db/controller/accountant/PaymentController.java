package com.billing_db.controller.accountant;

import com.billing_db.dto.payment.PaymentRequestDTO;
import com.billing_db.dto.payment.PaymentResponseDTO;
import com.billing_db.service.PaymentService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accountant/payments")
@CrossOrigin
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // 💰 MAKE PAYMENT (ADMIN / ACCOUNTANT)
    @PostMapping
    public PaymentResponseDTO makePayment(
            @RequestBody PaymentRequestDTO request) {

        return paymentService.makePayment(request);
    }

    // 📄 VIEW ALL PAYMENTS (ADMIN / ACCOUNTANT)
    @GetMapping
    public List<PaymentResponseDTO> getAllPayments() {

        return paymentService.getAllPayments();
    }
}
