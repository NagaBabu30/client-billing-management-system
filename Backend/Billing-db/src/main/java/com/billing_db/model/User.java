package com.billing_db.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false, length = 100)
    private String password;

    @Column(nullable = false)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    // 🔑 FIRST LOGIN FLAG (NEW)
    @Column(nullable = false)
    private boolean firstLogin = true;

    // 🔥 FIX: break infinite JSON loop
    @OneToOne(mappedBy = "user")
    @JsonIgnore
    private Client client;
}



