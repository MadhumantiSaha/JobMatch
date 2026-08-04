package com.example.OnlineJob.System.controller;

import com.example.OnlineJob.System.dtos.OTPRequest;
import com.example.OnlineJob.System.dtos.ResetPasswordRequest;
import com.example.OnlineJob.System.dtos.UpdateUserRequest;
import com.example.OnlineJob.System.model.User;
import com.example.OnlineJob.System.service.EmailService;
import com.example.OnlineJob.System.service.UserServices;
import com.example.OnlineJob.System.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserServices userServices;

    @Autowired
    private EmailService emailService;

    private final PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;


    public UserController() {
        this.passwordEncoder = new BCryptPasswordEncoder(12);
    }

//    CREATE
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> createUser(
            @ModelAttribute User user,
            @RequestParam(value = "imageFile", required = false)
            MultipartFile file) {

        Map<String, Object> response = new HashMap<>();

        try {

            User savedUser = userServices.saveUser(user, file);

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
        User user = userServices
                .findUserByEmail(st.getEmail())
                .orElse(null);

        if(user!=null)
        {
            String encryptedPassword = user.getPassword();
            String password = st.getPassword();

            System.out.println(password+" "+encryptedPassword);

            System.out.println("Input Password = " + password);
            System.out.println("DB Password = " + encryptedPassword);
            System.out.println("Password Match = " +
                    passwordEncoder.matches(password, encryptedPassword));

            if (passwordEncoder.matches(password, encryptedPassword)) {

                String token = jwtUtil.generateToken(
                        user.getId(),
                        user.getRole().name()
                );

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

    private String generateOtp() {
        Random random = new Random();
        return String.valueOf(
                100000 + random.nextInt(900000)
        );
    }

    // Forgot Password
    @PostMapping("/forget-password")
    public ResponseEntity<Map<String, Object>>
    recoverPassword(@RequestBody User st) {

        Map<String, Object> response =
                new HashMap<>();

        try {

            User user = userServices
                    .findUserByEmail(st.getEmail())
                    .orElseThrow(() ->
                            new RuntimeException("Email not found"));

            String otp = generateOtp();

            user.setOtp(otp);
            user.setOtpExpiry(
                    LocalDateTime.now().plusMinutes(5)
            );

            userServices.save(user);

            emailService.sendOtp(
                    user.getEmail(),
                    otp
            );

            response.put(
                    "success",
                    true
            );

            response.put(
                    "message",
                    "OTP sent successfully."
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            response.put(
                    "success",
                    false
            );

            response.put(
                    "error",
                    e.getMessage()
            );

            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(response);
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, Object>> verifyOtp(
            @RequestBody OTPRequest request) {

        Map<String, Object> response = new HashMap<>();

        try {

            User user = userServices
                    .findUserByEmail(request.getEmail())
                    .orElseThrow(() ->
                            new RuntimeException("User not found"));

//            System.out.println("Stored OTP = " + user.getOtp());
//            System.out.println("Received OTP = " + request.getOtp());
//            System.out.println("Expiry = " + user.getOtpExpiry());
//            System.out.println("Now = " + LocalDateTime.now());

            if (user.getOtp() == null) {
                response.put("success", false);
                response.put("message", "No OTP generated");
                return ResponseEntity.badRequest().body(response);
            }

            if (!user.getOtp().equals(request.getOtp())) {
                response.put("success", false);
                response.put("message", "Invalid OTP");
                return ResponseEntity.badRequest().body(response);
            }

            if (user.getOtpExpiry().isBefore(LocalDateTime.now())) {
                response.put("success", false);
                response.put("message", "OTP expired");
                return ResponseEntity.badRequest().body(response);
            }

            response.put("success", true);
            response.put("message", "OTP verified");



            return ResponseEntity.ok(response);

        } catch (Exception e) {

            response.put("success", false);
            response.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(response);
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody ResetPasswordRequest request) {

        User user = userServices
                .findUserByEmail(request.getEmail())
                .orElseThrow();

        String encodedPassword =
                passwordEncoder.encode(request.getPassword());

        System.out.println("Raw Password = " +
                request.getPassword());

        System.out.println("Encoded Password = " +
                encodedPassword);

        user.setPassword(encodedPassword);

        userServices.save(user);

        User savedUser = userServices
                .findUserByEmail(request.getEmail())
                .orElseThrow();

        System.out.println("Password in DB = " +
                savedUser.getPassword());

        user.setOtp(null);
        user.setOtpExpiry(null);

        userServices.save(user);

        return ResponseEntity.ok(
                "Password reset successful");
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

//    Update user details

    @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateUser(
            @ModelAttribute UpdateUserRequest request,          // ← DTO instead of User
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile,
            @RequestParam(value = "resumeFile", required = false) MultipartFile resumeFile,
            @RequestParam(value = "companyFile", required = false) MultipartFile companyFile,
            @RequestHeader("Authorization") String authHeader) {

        Map<String, Object> response = new HashMap<>();

        try {
            String token = authHeader.substring(7);
            Long userId = jwtUtil.extractId(token);

            User updatedUser = userServices.updateUser(
                    userId, request, imageFile, resumeFile, companyFile
            );

            // Never return the full entity with password
            response.put("success", true);
            response.put("message", "Profile updated successfully");
            response.put("data", updatedUser);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
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
