package com.billing_db.service;

import com.billing_db.repository.ClientRepository;
import com.billing_db.repository.ProductRepository;
import com.billing_db.repository.InvoiceRepository;
import com.billing_db.model.*;
import com.billing_db.dto.invoice.InvoiceRequest;
import com.billing_db.dto.invoice.InvoiceItemRequest;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import java.util.*;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Transactional
public class InvoiceService {

    private final ClientRepository clientRepository;
    private final ProductRepository productRepository;
    private final InvoiceRepository invoiceRepository;
    private final PdfService pdfService;
    private final EmailService emailService;

    // ➕ CREATE INVOICE (ADMIN / ACCOUNTANT)
    public Invoice createInvoice(InvoiceRequest request) {

        Client client = clientRepository.findById(request.getClientId())
                .orElseThrow(() -> new RuntimeException("Client not found"));

        if (client.getUser() == null) {
            throw new RuntimeException("Client is not linked to a user");
        }

        Invoice invoice = new Invoice();
        invoice.setClient(client);
        invoice.setIssueDate(LocalDate.now());
        invoice.setDueDate(LocalDate.now().plusDays(15));
        invoice.setStatus(InvoiceStatus.UNPAID);
        invoice.setPaidAmount(0.0);

        List<InvoiceItem> items = new ArrayList<>();
        double totalAmount = 0.0;

        for (InvoiceItemRequest req : request.getItems()) {

            Product product = productRepository.findById(req.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            int qty = req.getQuantity();
            double base = product.getPrice() * qty;
            double discountAmount = base * product.getDiscount() / 100;
            double taxableAmount = base - discountAmount;
            double taxAmount = taxableAmount * product.getTax() / 100;
            double itemTotal = taxableAmount + taxAmount;

            InvoiceItem item = new InvoiceItem();
            item.setInvoice(invoice);
            item.setProduct(product);
            item.setQuantity(qty);
            item.setPrice(product.getPrice());
            item.setDiscount(product.getDiscount());
            item.setTax(product.getTax());
            item.setTotal(itemTotal);   // ✅ FIXED

            items.add(item);
            totalAmount += itemTotal;
        }

        invoice.setItems(items);
        invoice.setTotalAmount(totalAmount);
        invoice.setBalance(totalAmount);

        Invoice savedInvoice = invoiceRepository.save(invoice);

        // 📧 PDF + EMAIL (OPTIONAL)
        try {
            byte[] pdfBytes = pdfService.generateInvoicePdf(savedInvoice);
            emailService.sendInvoiceEmail(
                    savedInvoice.getClient().getEmail(),
                    pdfBytes,
                    "invoice_" + savedInvoice.getId() + ".pdf"
            );
        } catch (Exception e) {
            System.err.println("EMAIL FAILED");
        }

        return savedInvoice;
    }

    // ✏️ UPDATE INVOICE (ONLY IF UNPAID)
    public Invoice updateInvoice(Long id, InvoiceRequest request) {

        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        if (invoice.getStatus() != InvoiceStatus.UNPAID) {
            throw new RuntimeException("Only UNPAID invoice can be edited");
        }

        invoice.getItems().clear(); // orphanRemoval deletes old items

        double totalAmount = 0.0;

        for (InvoiceItemRequest req : request.getItems()) {

            Product product = productRepository.findById(req.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            int qty = req.getQuantity();
            double base = product.getPrice() * qty;
            double discountAmount = base * product.getDiscount() / 100;
            double taxableAmount = base - discountAmount;
            double taxAmount = taxableAmount * product.getTax() / 100;
            double itemTotal = taxableAmount + taxAmount;

            InvoiceItem item = new InvoiceItem();
            item.setInvoice(invoice);
            item.setProduct(product);
            item.setQuantity(qty);
            item.setPrice(product.getPrice());
            item.setDiscount(product.getDiscount());
            item.setTax(product.getTax());
            item.setTotal(itemTotal);

            invoice.getItems().add(item);
            totalAmount += itemTotal;
        }

        invoice.setTotalAmount(totalAmount);
        invoice.setBalance(totalAmount - invoice.getPaidAmount());

        return invoiceRepository.save(invoice);
    }

    // ❌ DELETE INVOICE (ADMIN ONLY, UNPAID)
    public void deleteInvoice(Long id) {

        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        if (invoice.getStatus() != InvoiceStatus.UNPAID) {
            throw new RuntimeException("Paid invoice cannot be deleted");
        }

        invoiceRepository.delete(invoice);
    }

    // 📄 ADMIN / ACCOUNTANT
    public List<Invoice> getAll() {
        return invoiceRepository.findAll();
    }

    public Invoice getById(Long id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
    }

    // 👤 CLIENT – OWN INVOICES ONLY
    public List<Invoice> getInvoicesByUsername(String username) {
        return invoiceRepository.findByClientUserUsername(username);
    }

    public Invoice getInvoiceForClient(Long invoiceId, String username) {
        return invoiceRepository
                .findByIdAndClientUserUsername(invoiceId, username)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
    }
}




