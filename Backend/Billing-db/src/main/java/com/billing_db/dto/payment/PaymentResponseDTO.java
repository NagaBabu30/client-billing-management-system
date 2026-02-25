package com.billing_db.dto.payment;
import java.time.LocalDate;
import lombok.Data;

@Data
public class PaymentResponseDTO {

    private Long id;
    private double amount;
    private String paymentMode;
    private String status;
    private LocalDate paymentDate;
    private Long invoiceId;
}
