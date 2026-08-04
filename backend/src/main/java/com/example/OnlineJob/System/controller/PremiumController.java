package com.example.OnlineJob.System.controller;

//import com.example.OnlineJob.System.dtos.CreateOrderRequest;
import com.example.OnlineJob.System.dtos.VerifyPaymentRequest;
import com.example.OnlineJob.System.model.Premium;
import com.example.OnlineJob.System.model.User;
import com.example.OnlineJob.System.repository.UserRepository;
import com.example.OnlineJob.System.service.PremiumJobAlertService;
import com.example.OnlineJob.System.service.PremiumService;
import com.example.OnlineJob.System.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/premium")
@CrossOrigin(origins = "http://localhost:5173")
public class PremiumController {

    @Autowired private PremiumService premiumService;
    @Autowired private PremiumJobAlertService premiumJobAlertService;
    @Autowired private UserRepository userRepository;
    @Autowired private JwtUtil jwtUtil;

    @Value("${razorpay.key_id}")
    private String keyId;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(
            @RequestHeader("Authorization") String authHeader) {

        try {
            String token = authHeader.substring(7);
            Long userId = jwtUtil.extractId(token);

            System.out.println(userId);

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Map<String, Object> order = premiumService.createOrder(user);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("order", order);
            response.put("key", keyId);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(
            @RequestBody VerifyPaymentRequest request,
            @RequestHeader("Authorization") String authHeader) {

        try {
            String token = authHeader.substring(7);
            Long userId = jwtUtil.extractId(token);

            Premium premium = premiumService.verifyPayment(
                    request.getRazorpayOrderId(),
                    request.getRazorpayPaymentId(),
                    request.getRazorpaySignature(),
                    userId
            );

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", getActionMessage(premium.getLastAction()));
            response.put("premium", premium);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    private String getActionMessage(String action) {
        return switch (action) {
            case "NEW" -> "Premium membership activated successfully!";
            case "EXTENDED" -> "Your premium plan has been extended successfully!";
            case "UPGRADED" -> "Congratulations! Your membership has been upgraded!";
            case "REPLACED" -> "Membership plan updated successfully.";
            default -> "Premium membership updated.";
        };
    }

    @GetMapping("/my-membership")
    public ResponseEntity<?> getMyMembership(@RequestHeader("Authorization") String authHeader) {

        try {
            String token = authHeader.substring(7);
            Long userId = jwtUtil.extractId(token);   // same way you extract in other places

            Optional<Premium> premiumOpt = premiumService.getMembership(userId);

            if (premiumOpt.isEmpty()) {
                return ResponseEntity.ok(null);   // or return a message
            }

            Premium premium = premiumOpt.get();

            // Only return if still ACTIVE and not expired
            if (premium.getMembershipStatus() == Premium.MembershipStatus.ACTIVE
                    && premium.getEndDate().isAfter(LocalDate.now())) {

                return ResponseEntity.ok(premium);
            }

            return ResponseEntity.ok(null);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/status")
    public ResponseEntity<?> premiumStatus(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long userId = jwtUtil.extractId(token);

        Map<String, Object> response = new HashMap<>();
        response.put("premium", premiumService.isPremium(userId));
        return ResponseEntity.ok(response);
    }



    @PostMapping("/deactivate")
    public ResponseEntity<?> deactivateMembership(@RequestHeader("Authorization") String authHeader) {

        String token = authHeader.substring(7);
        Long userId = jwtUtil.extractId(token);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        try {
            Premium deactivated = premiumService.deactivateMembership(userId);
            return ResponseEntity.ok(Map.of(
                    "message", "Premium membership deactivated successfully",
                    "status", deactivated.getMembershipStatus(),
                    "lastAction", deactivated.getLastAction()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

}