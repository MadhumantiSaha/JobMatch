package com.example.OnlineJob.System.service;

import com.example.OnlineJob.System.model.Job;
import com.example.OnlineJob.System.model.Premium;
import com.example.OnlineJob.System.model.User;
import com.example.OnlineJob.System.repository.JobRepository;
import com.example.OnlineJob.System.repository.PremiumRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
public class PremiumJobAlertService {

    @Autowired
    private PremiumRepository premiumRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private EmailService emailService;

    @Scheduled(cron = "0 0 9 * * *")
    public void sendPremiumEndAlert() {

        List<Premium> activePremiums = premiumRepository
                .findByMembershipStatus(Premium.MembershipStatus.ACTIVE);

        LocalDate reminderDate = LocalDate.now().plusDays(5);

        for (Premium premium : activePremiums) {

            try {
                if (premium.getEndDate() != null &&
                        premium.getEndDate().isEqual(reminderDate)) {
                    User user = premium.getUser();
                    if (user != null) {
                        emailService.sendPremiumEndAlert(
                                user.getEmail(),
                                user
                        );
                    }
                }

            } catch (Exception e) {
                System.err.println(
                        "Reminder failed for premium id="
                                + premium.getId() + ": "
                                + e.getMessage()
                );
            }
        }
    }

    public void sendPremiumJobDigests() {
        System.out.println(">>> Premium Job Digest started...");
        List<Premium> activePremiums = premiumRepository
                .findByMembershipStatus(Premium.MembershipStatus.ACTIVE);

        for (Premium premium : activePremiums) {
            try {
                processSingleUserDigest(premium.getId());
            } catch (Exception e) {
                System.err.println("Digest failed for premium id=" + premium.getId() + ": " + e.getMessage());
            }
        }
    }

    @Transactional
    public void processSingleUserDigest(Long premiumId) {
        Premium premium = premiumRepository.findById(premiumId)
                .orElseThrow(() -> new RuntimeException("Premium not found"));

        if (premium.getEndDate() == null || premium.getEndDate().isBefore(LocalDate.now())) {
            return;
        }  // if premium is end for the user

        User user = premium.getUser();
        if (user == null || user.getRole() != User.Role.job_seeker) return;   //will not be eligible for providers

        Set<String> userSkills = user.getSkills();
        if (userSkills == null || userSkills.isEmpty()) return;

        LocalDateTime since = (premium.getLastDigestSentAt() != null)
                ? premium.getLastDigestSentAt()
                : LocalDateTime.now();

        List<Job> matchingJobs = jobRepository.findMatchingJobs(userSkills, since);

        if (!matchingJobs.isEmpty()) {
            emailService.sendJobDigest(user, matchingJobs);
            premium.setLastDigestSentAt(LocalDateTime.now());
            premiumRepository.save(premium);
        }
    }
}