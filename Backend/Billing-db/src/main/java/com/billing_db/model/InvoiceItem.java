package com.billing_db.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class InvoiceItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔐 BELONGS TO ONE INVOICE
    @ManyToOne(optional = false)
    @JoinColumn(name = "invoice_id")
    @JsonBackReference
    private Invoice invoice;

    // 📦 PRODUCT SNAPSHOT
    @ManyToOne(optional = false)
    @JoinColumn(name = "product_id")
    private Product product;

    private int quantity;

    // Snapshot values at invoice time
    private double price;        // unit price
    private double discount;     // %
    private double tax;          // %

    // Calculated & stored
    private double total;        // final item total
}


