package com.billing_db.repository;

import com.billing_db.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // 🔍 CHECK PRODUCT BY NAME (ADMIN USE)
    Optional<Product> findByName(String name);
}
