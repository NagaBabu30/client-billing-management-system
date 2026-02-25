package com.billing_db.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@Entity
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Client client;

    @OneToMany(
            mappedBy = "invoice",
            cascade = CascadeType.ALL,
            orphanRemoval = true   // ✅ IMPORTANT FIX
    )
    private List<InvoiceItem> items;

    private double totalAmount;
    private double paidAmount;
    private double balance;

    @Enumerated(EnumType.STRING)
    private InvoiceStatus status;

    private LocalDate issueDate;
    private LocalDate dueDate;
}
