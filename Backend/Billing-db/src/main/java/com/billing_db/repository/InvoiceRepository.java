package com.billing_db.repository;

import com.billing_db.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    // 👤 CLIENT – GET OWN INVOICES
    List<Invoice> findByClientUserUsername(String username);

    // 🔐 CLIENT – GET OWN INVOICE BY ID
    Optional<Invoice> findByIdAndClientUserUsername(
            Long id,
            String username
    );
}

