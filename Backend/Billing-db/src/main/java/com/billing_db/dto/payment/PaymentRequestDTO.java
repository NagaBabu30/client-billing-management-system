package com.billing_db.dto.payment;

import com.billing_db.model.PaymentMode;
import lombok.Data;

@Data
public class PaymentRequestDTO {

    private Long invoiceId;
    private double amount;

    // ✅ ENUM (NOT STRING)
    private PaymentMode paymentMode;
}
