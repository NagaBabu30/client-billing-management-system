package com.billing_db.controller.admin;

import com.billing_db.model.Client;
import com.billing_db.model.Role;
import com.billing_db.model.User;
import com.billing_db.repository.ClientRepository;
import com.billing_db.repository.UserRepository;
import com.billing_db.service.EmailService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/clients")
@CrossOrigin
public class AdminController {

    private final ClientRepository clientRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService; // ✅ ADD

    public AdminController(
            ClientRepository clientRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            EmailService emailService) {

        this.clientRepository = clientRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService; // ✅ ADD
    }

    // ✅ GET ALL CLIENTS
    @GetMapping
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    // ✅ CREATE CLIENT (EMAIL + TEMP PASSWORD)
    @PostMapping
    public ResponseEntity<Client> createClient(@RequestBody Client client) {

        if (userRepository.findByUsername(client.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().build();
        }

        // 🔐 TEMP PASSWORD
        String tempPassword =
                UUID.randomUUID().toString().substring(0, 8);

        User user = new User();
        user.setUsername(client.getEmail());
        user.setEmail(client.getEmail());
        user.setPassword(passwordEncoder.encode(tempPassword));
        user.setRole(Role.CLIENT);
        user.setFirstLogin(true);

        User savedUser = userRepository.save(user);

        client.setUser(savedUser);
        Client savedClient = clientRepository.save(client);

        // 📧 SEND EMAIL (REAL INDUSTRY FLOW)
        emailService.sendClientCredentials(
                client.getEmail(),
                client.getEmail(),
                tempPassword
        );

        return ResponseEntity.ok(savedClient);
    }

    // ✅ UPDATE CLIENT
    @PutMapping("/{id}")
    public ResponseEntity<Client> updateClient(
            @PathVariable Long id,
            @RequestBody Client updatedClient) {

        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        client.setName(updatedClient.getName());
        client.setEmail(updatedClient.getEmail());
        client.setPhone(updatedClient.getPhone());
        client.setCompanyName(updatedClient.getCompanyName());
        client.setAddress(updatedClient.getAddress());

        // 🔄 SYNC USER
        User user = client.getUser();
        if (user != null) {
            user.setUsername(updatedClient.getEmail());
            user.setEmail(updatedClient.getEmail());
            userRepository.save(user);
        }

        return ResponseEntity.ok(clientRepository.save(client));
    }

    // ✅ DELETE CLIENT + USER
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable Long id) {

        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        User user = client.getUser();

        clientRepository.delete(client);

        if (user != null) {
            userRepository.delete(user);
        }

        return ResponseEntity.noContent().build();
    }
}


