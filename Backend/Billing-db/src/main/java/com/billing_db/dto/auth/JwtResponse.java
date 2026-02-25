package com.billing_db.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtResponse {

    private String token;
    private String username;
    private String role;

    // 🔑 FIRST LOGIN INFO (NEW)
    private boolean firstLogin;
}

