package com.billing_db.controller.accountant;

import com.billing_db.model.Product;
import com.billing_db.repository.ProductRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accountant/products")
@CrossOrigin
public class ProductViewController {

    private final ProductRepository productRepository;

    public ProductViewController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // 👀 READ ONLY – ACCOUNTANT
    @GetMapping
    public List<Product> viewProducts() {
        return productRepository.findAll();
    }
}

