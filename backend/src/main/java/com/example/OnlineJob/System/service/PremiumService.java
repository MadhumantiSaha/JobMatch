package com.example.OnlineJob.System.service;

import com.example.OnlineJob.System.model.Premium;
import com.example.OnlineJob.System.model.User;
import com.example.OnlineJob.System.repository.PremiumRepository;
import com.example.OnlineJob.System.repository.UserRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;

@Service
public class PremiumService {

    @Autowired
    private PremiumRepository premiumRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Value("${razorpay.key_id}")
    private String keyId;

    @Value("${razorpay.key_secret}")
    private String keySecret;

    private static final int PREMIUM_AMOUNT = 499;      // ₹499
    private static final int PREMIUM_DURATION = 30;     // 30 days

    // ---------------- CREATE ORDER ----------------
    public Map<String, Object> createOrder(User user) throws Exception {

        RazorpayClient client = new RazorpayClient(keyId, keySecret);

        JSONObject options = new JSONObject();
        options.put("amount", PREMIUM_AMOUNT * 100);
        options.put("currency", "INR");
        options.put("receipt", "premium_" + user.getId());

        Order order = client.orders.create(options);

        return order.toJson().toMap();
    }

    // ---------------- VERIFY PAYMENT ----------------
    @Transactional
    public Premium verifyPayment(
            String razorpayOrderId,
            String razorpayPaymentId,
            String razorpaySignature,
            Long userId)
            throws Exception {

        JSONObject json = new JSONObject();
        json.put("razorpay_order_id", razorpayOrderId);
        json.put("razorpay_payment_id", razorpayPaymentId);
        json.put("razorpay_signature", razorpaySignature);

        boolean verified = Utils.verifyPaymentSignature(json, keySecret);

        if (!verified) {
            throw new RuntimeException("Payment verification failed");
        }

        return activateMembership(
                userId,
                razorpayOrderId,
                razorpayPaymentId,
                razorpaySignature
        );
    }
    // ---------------- MAIN UPGRADE / ACTIVATION LOGIC ----------------
    @Transactional
    public Premium activateMembership(
            Long userId,
            String razorpayOrderId,
            String razorpayPaymentId,
            String razorpaySignature) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Premium premium = premiumRepository
                .findByUser(user)
                .orElse(new Premium());

        premium.setUser(user);
        premium.setRazorpayOrderId(razorpayOrderId);
        premium.setRazorpayPaymentId(razorpayPaymentId);
        premium.setRazorpaySignature(razorpaySignature);
        premium.setMembershipStatus(Premium.MembershipStatus.ACTIVE);
        premium.setStartDate(LocalDate.now());
        premium.setAmount(PREMIUM_AMOUNT);

        if (premium.getEndDate() != null &&
                premium.getEndDate().isAfter(LocalDate.now())) {

            // Renewal
            premium.setLastAction("RENEWED");
            premium.setEndDate(
                    premium.getEndDate().plusDays(PREMIUM_DURATION)
            );

        } else {

            // First purchase
            premium.setLastAction("NEW");
            premium.setEndDate(
                    LocalDate.now().plusDays(PREMIUM_DURATION)
            );
        }

        Premium saved = premiumRepository.save(premium);

        try {
            emailService.sendPremiumEmail(
                    user.getEmail(),
                    user.getName(),
                    saved.getLastAction(),
                    saved.getEndDate().toString()
            );
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }

        return saved;
    }

//    // Helper: Check if new tier is higher
//    private boolean isHigherTier(Premium.Membership newTier, Premium.Membership currentTier) {
//        return getTierLevel(newTier) > getTierLevel(currentTier);
//    }
//
//    private int getTierLevel(Premium.Membership membership) {
//        return switch (membership) {
//            case SILVER -> 1;
//            case GOLDEN -> 2;
//            case PLATINUM -> 3;
//        };
//    }
//
//    // Calculate full duration from today
//    private LocalDate calculateNewEndDate(Premium.Membership membership) {
//        return switch (membership) {
//            case SILVER -> LocalDate.now().plusDays(30);
//            case GOLDEN -> LocalDate.now().plusDays(90);
//            case PLATINUM -> LocalDate.now().plusDays(365);
//        };
//    }

//    // Extend existing plan
//    private LocalDate extendEndDate(LocalDate currentEndDate, Premium.Membership membership) {
//        LocalDate newEnd = currentEndDate.isAfter(LocalDate.now()) ? currentEndDate : LocalDate.now();
//        return switch (membership) {
//            case SILVER -> newEnd.plusDays(30);
//            case GOLDEN -> newEnd.plusDays(90);
//            case PLATINUM -> newEnd.plusDays(365);
//        };
//    }

    // ---------------- GET MEMBERSHIP ----------------
    public Optional<Premium> getMembership(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return premiumRepository.findByUser(user);
    }

//     ---------------- CHECK PREMIUM ----------------
    public boolean isPremium(Long userId) {
        Optional<Premium> optional = getMembership(userId);

        if(optional.isEmpty())
            return false;

        Premium premium = optional.get();

        if(premium.getEndDate().isBefore(LocalDate.now())){

            premium.setMembershipStatus(
                    Premium.MembershipStatus.DEACTIVE
            );

            premiumRepository.save(premium);

            return false;

        }

        return premium.getMembershipStatus()==Premium.MembershipStatus.ACTIVE;
    }



    // ---------------- EXPIRE MEMBERSHIPS ----------------
    @Scheduled(cron = "0 0 0 * * ?")
    public void expireMemberships() {
        premiumRepository.findByMembershipStatus(Premium.MembershipStatus.ACTIVE)
                .forEach(premium -> {
                    if (premium.getEndDate().isBefore(LocalDate.now())) {
                        premium.setMembershipStatus(Premium.MembershipStatus.DEACTIVE);
                        premiumRepository.save(premium);
                    }
                });
    }

//    // ---------------- HELPER ----------------
//    private int getAmount(Premium.Membership membership) {
//        return switch (membership) {
//            case SILVER -> 10;
//            case GOLDEN -> 40;
//            case PLATINUM -> 90;
//        };
//    }

    @Transactional
    public Premium deactivateMembership(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Premium premium = premiumRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("No premium membership found"));

        // Only allow deactivation if currently active
        if (premium.getMembershipStatus() != Premium.MembershipStatus.ACTIVE) {
            throw new RuntimeException("Membership is already inactive");
        }

        // Deactivate
        premium.setMembershipStatus(Premium.MembershipStatus.DEACTIVE);
        premium.setLastAction("DEACTIVATED");


        Premium saved = premiumRepository.save(premium);

        // Send email notification
        try {
            emailService.sendPremiumDeactivationEmail(
                    user.getEmail(),
                    user.getName()
            );
        } catch (Exception e) {
            System.err.println("Failed to send premium email: " + e.getMessage());
        }

        return saved;
    }
}