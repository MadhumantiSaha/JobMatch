package com.example.OnlineJob.System.controller;

import com.example.OnlineJob.System.model.Product;
import com.example.OnlineJob.System.model.User;
import com.example.OnlineJob.System.service.ProductServices;
import com.example.OnlineJob.System.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/product")
public class ProductController {
    @Autowired
    private ProductServices productServices;

    @Autowired
    private JwtUtil jwtUtil;

//    CREATE
    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadProduct(
            @ModelAttribute Product product,
            @RequestParam("imageFile") MultipartFile file,
            @RequestHeader("Authorization") String authHeader)
            throws IOException {

        Map<String, Object> response = new HashMap<>();

        try {
//            Remove "Bearer " prefix
            String token = authHeader.substring(7);

            // Extract user ID from JWT
            Long userId = jwtUtil.extractId(token);
//            System.out.println("Userid: "+userId);
            // Set user ID in Job
            User u = new User();
            u.setId(userId);
            product.setUserID(u);

            Product savedProduct = productServices.saveProduct(product, file);

            response.put("success", true);
            response.put("data", savedProduct);

            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (Exception e) {

            response.put("success", false);
            response.put("error", e.getMessage());

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    // READ ALL
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllProducts() {

        Map<String, Object> response = new HashMap<>();

        try {
            List<Product> products = productServices.getAllProducts();

            response.put("success", true);
            response.put("data", products);

            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (Exception e) {

            response.put("success", false);
            response.put("error", e.getMessage());

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // READ BY ID
    @GetMapping("/id")
    public ResponseEntity<Map<String, Object>> getMyProductss(
            @RequestHeader("Authorization") String authHeader) {

        Map<String, Object> response = new HashMap<>();

        try {
            String token = authHeader.substring(7);
            Long id = jwtUtil.extractId(token);

            System.out.println("Id: "+id);

            User u = new User();
            u.setId(id);

            List<Product> products = productServices.getProductsId(u);

            response.put("success", true);
            response.put("data", products);

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            response.put("success", false);
            response.put("error", e.getMessage());

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // UPDATE
    @PutMapping(value = "/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> updateProducts(
            @PathVariable Long id,
            @RequestBody Product product) {

        Map<String, Object> response = new HashMap<>();

        try {
            Product updatedProduct = productServices.updateProduct(id, product);

            response.put("success", true);
            response.put("message", "Job updated successfully");
            response.put("data", updatedProduct);

            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (Exception e) {

            response.put("success", false);
            response.put("error", e.getMessage());

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteProducts(@PathVariable Long id) {

        Map<String, Object> response = new HashMap<>();

        try {
            String message = productServices.deleteProduct(id);

            response.put("success", true);
            response.put("message", message);

            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (Exception e) {

            response.put("success", false);
            response.put("error", e.getMessage());

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

