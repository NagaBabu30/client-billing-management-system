package com.billing_db.dto.auth;

import lombok.Data;

@Data
public class SignupRequest {

    private String username;
    private String email;
    private String password;

    // 👇 NEW (ADMIN / ACCOUNTANT / CLIENT)
    private String role;
}
