package com.billing_db.controller;

import com.billing_db.dto.auth.LoginRequest;
import com.billing_db.dto.auth.SignupRequest;
import com.billing_db.dto.auth.JwtResponse;
import com.billing_db.dto.auth.ResetPasswordRequest;
import com.billing_db.model.Role;
import com.billing_db.model.User;
import com.billing_db.repository.UserRepository;
import com.billing_db.security.JwtUtils;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthController(AuthenticationManager authenticationManager,
                          UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    // 🔐 LOGIN (ADMIN / ACCOUNTANT / CLIENT)
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(
            @RequestBody LoginRequest loginRequest) {

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                loginRequest.getUsername(),
                                loginRequest.getPassword()
                        )
                );

        SecurityContextHolder.getContext()
                .setAuthentication(authentication);

        String jwtToken = jwtUtils.generateToken(authentication);

        User user = userRepository
                .findByUsername(loginRequest.getUsername())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return ResponseEntity.ok(
                new JwtResponse(
                        jwtToken,
                        user.getUsername(),
                        user.getRole().name(),
                        user.isFirstLogin() // 🔑 VERY IMPORTANT
                )
        );
    }

    // 📝 SIGNUP (OPTIONAL – mostly ADMIN use)
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(
            @RequestBody SignupRequest signupRequest) {

        if (userRepository.existsByUsername(signupRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body("Username already exists");
        }

        User user = new User();
        user.setUsername(signupRequest.getUsername());
        user.setEmail(signupRequest.getEmail());
        user.setPassword(
                passwordEncoder.encode(signupRequest.getPassword())
        );

        if (signupRequest.getRole() == null ||
                signupRequest.getRole().isBlank()) {

            user.setRole(Role.CLIENT);
        } else {
            user.setRole(
                    Role.valueOf(
                            signupRequest.getRole().toUpperCase()
                    )
            );
        }

        user.setFirstLogin(false);

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully");
    }

    // 🔁 RESET PASSWORD (CLIENT FIRST LOGIN)
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody ResetPasswordRequest request) {

        User user = userRepository
                .findByUsername(request.getUsername())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // 🔐 OLD PASSWORD CHECK
        if (!passwordEncoder.matches(
                request.getOldPassword(),
                user.getPassword())) {

            return ResponseEntity
                    .badRequest()
                    .body("Old password is incorrect");
        }

        // 🔐 SET NEW PASSWORD
        user.setPassword(
                passwordEncoder.encode(request.getNewPassword())
        );

        // ✅ FIRST LOGIN COMPLETED
        user.setFirstLogin(false);

        userRepository.save(user);

        return ResponseEntity.ok("Password reset successful");
    }
}




