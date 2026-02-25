package com.billing_db.repository;

import com.billing_db.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Long> {

    // 🔐 Get client for logged-in user
    Optional<Client> findByUserUsername(String username);
}
