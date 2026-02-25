package com.billing_db.controller.admin;

import com.billing_db.service.InvoiceService;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/admin/invoices")
@CrossOrigin
@PreAuthorize("hasRole('ADMIN')")
public class AdminInvoiceController {

    private final InvoiceService service;

    public AdminInvoiceController(InvoiceService service) {
        this.service = service;
    }

    // ❌ DELETE INVOICE (ONLY IF UNPAID)
    @DeleteMapping("/{id}")
    public void deleteInvoice(@PathVariable Long id) {
        service.deleteInvoice(id);
    }
}
