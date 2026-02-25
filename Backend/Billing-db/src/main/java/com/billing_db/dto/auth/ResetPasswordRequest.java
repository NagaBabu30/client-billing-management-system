package com.billing_db.dto.auth;

import lombok.Data;

@Data
public class ResetPasswordRequest {
    private String username;
    private String oldPassword;
    private String newPassword;
}
