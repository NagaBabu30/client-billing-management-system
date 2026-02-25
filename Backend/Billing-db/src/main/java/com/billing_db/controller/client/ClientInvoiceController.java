package com.billing_db.controller.client;

import com.billing_db.model.Invoice;
import com.billing_db.service.InvoiceService;
import com.billing_db.service.PdfService;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import lombok.RequiredArgsConstructor;
import java.util.List;

@RestController
@RequestMapping("/api/client/invoices")
@RequiredArgsConstructor
@CrossOrigin
public class ClientInvoiceController {

    private final InvoiceService service;
    private final PdfService pdfService;

    // ✅ GET OWN INVOICES
    @GetMapping
    public List<Invoice> getMyInvoices(Authentication auth) {
        return service.getInvoicesByUsername(auth.getName());
    }

    // ✅ GET SINGLE OWN INVOICE (🔥 THIS WAS MISSING)
    @GetMapping("/{id}")
    public Invoice getMyInvoiceById(
            @PathVariable Long id,
            Authentication auth) {

        return service.getInvoiceForClient(id, auth.getName());
    }

    // ✅ DOWNLOAD OWN INVOICE PDF
    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> exportMyInvoicePdf(
            @PathVariable Long id,
            Authentication auth) {

        Invoice invoice =
                service.getInvoiceForClient(id, auth.getName());

        byte[] pdf = pdfService.generateInvoicePdf(invoice);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=invoice_" + id + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
