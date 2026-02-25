package com.billing_db.dto.invoice;

import lombok.Data;
import java.util.List;

@Data
public class InvoiceRequest {

    private Long clientId;
    private List<InvoiceItemRequest> items;
}
