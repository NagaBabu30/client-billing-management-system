package com.billing_db.controller.accountant;
import com.billing_db.model.Client;
import com.billing_db.repository.ClientRepository;
import org.springframework.web.bind.annotation.*;

        import java.util.List;

@RestController
@RequestMapping("/api/accountant/clients")
@CrossOrigin
public class ClientViewController {

    private final ClientRepository clientRepository;

    public ClientViewController(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    // 👀 READ ONLY – ACCOUNTANT
    @GetMapping
    public List<Client> viewClients() {
        return clientRepository.findAll();
    }
}
