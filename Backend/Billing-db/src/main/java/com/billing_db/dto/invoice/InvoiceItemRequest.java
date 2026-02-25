package com.billing_db.dto.invoice;

import lombok.Data;

@Data
public class InvoiceItemRequest {

    private Long productId;
    private int quantity;
}


