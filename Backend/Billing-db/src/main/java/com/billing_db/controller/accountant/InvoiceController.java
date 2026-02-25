package com.billing_db.controller.accountant;

import com.billing_db.dto.invoice.InvoiceRequest;
import com.billing_db.model.Invoice;
import com.billing_db.service.InvoiceService;
import com.billing_db.service.PdfService;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import lombok.RequiredArgsConstructor;
import java.util.List;

@RestController
@RequestMapping("/api/accountant/invoices")
@RequiredArgsConstructor
@CrossOrigin
public class InvoiceController {

    private final InvoiceService service;
    private final PdfService pdfService;

    // ➕ CREATE INVOICE (ADMIN / ACCOUNTANT)
    @PostMapping
    public Invoice create(@RequestBody InvoiceRequest request) {
        return service.createInvoice(request);
    }

    // 📄 GET ALL INVOICES
    @GetMapping
    public List<Invoice> getAll() {
        return service.getAll();
    }

    // 🔍 GET INVOICE BY ID
    @GetMapping("/{id}")
    public Invoice getById(@PathVariable Long id) {
        return service.getById(id);
    }

    // ✏️ UPDATE INVOICE (ONLY IF UNPAID)
    @PutMapping("/{id}")
    public Invoice update(
            @PathVariable Long id,
            @RequestBody InvoiceRequest request) {

        return service.updateInvoice(id, request);
    }

    // 📄 DOWNLOAD PDF
    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> exportInvoicePdf(@PathVariable Long id) {

        Invoice invoice = service.getById(id);
        byte[] pdf = pdfService.generateInvoicePdf(invoice);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=invoice_" + id + ".pdf"
                )
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}

