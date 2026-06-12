package com.example.OnlineJob.System.controller;

import com.example.OnlineJob.System.model.User;
import com.example.OnlineJob.System.service.UserServices;
import com.example.OnlineJob.System.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserServices userServices;

    private final PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public UserController() {
        this.passwordEncoder = new BCryptPasswordEncoder(12);
    }

//    CREATE
    @PostMapping
    public ResponseEntity<Map<String, Object>> createUser(@RequestBody User user) {
        Map<String, Object> response = new HashMap<>();

        try{
            User savedUser = userServices.saveUser(user);
            response.put("success", true);
            response.put("message", "User created successfully");
            response.put("data", savedUser);

            return new ResponseEntity<>(response, HttpStatus.CREATED);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to create user");
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
//    LOGIN
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody User st) {

    Map<String, Object> response = new HashMap<>();

    try {
        User user = userServices.findUserByEmail(st.getEmail());

        if(user!=null)
        {
            String encryptedPassword = user.getPassword();
            String password = st.getPassword();

            System.out.println(password+" "+encryptedPassword);

            if (passwordEncoder.matches(password, encryptedPassword)) {

                String token = jwtUtil.generateToken(user.getId());

                response.put("success", true);
                response.put("data", user);
                response.put("message", "Login Successful");
                response.put("token", token);

                return new ResponseEntity<>(response, HttpStatus.OK);  // Changed to OK
            }
            else {
                response.put("success", true);
                response.put("Error", "Password does not match for specified ID");
                return new ResponseEntity<>(response, HttpStatus.OK);  // Changed to OK
            }
        }
        else {
            response.put("success", true);
            response.put("Error", "ID not found");
            return new ResponseEntity<>(response, HttpStatus.OK);  // Changed to OK
        }


    } catch (Exception e) {
        response.put("success", false);
        response.put("Error", e.getMessage());
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }
    }
//    READ ALL
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllUser() {

        Map<String, Object> response = new HashMap<>();

        try {
            List<User> user = userServices.getAllUser();

            response.put("success", true);
            response.put("data", user);

            return new ResponseEntity<>(response, HttpStatus.OK);  // Changed to OK

        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
//    READ BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getUserById(@PathVariable Long id) {

        Map<String, Object> response = new HashMap<>();

        try {
            User user = userServices.getUserById(id)
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

            response.put("success", true);
            response.put("data", user);

            return new ResponseEntity<>(response, HttpStatus.OK);  // Changed to OK

        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }
//    UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateUser(
            @PathVariable Long id,
            @RequestBody User user) {

        Map<String, Object> response = new HashMap<>();

        try {
            User updateUser = userServices.updateUser(id, user);

            response.put("success", true);
            response.put("data", updateUser);
            response.put("message", "User details updated successfully");

            return new ResponseEntity<>(response, HttpStatus.OK);  // Changed to OK

        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
//    DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable Long id) {

        Map<String, Object> response = new HashMap<>();

        try {
            userServices.deleteUser(id);

            response.put("success", true);
            response.put("message", "User deleted successfully");

            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
