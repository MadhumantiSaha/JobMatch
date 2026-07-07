package com.example.OnlineJob.System.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtp(String email, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Password Reset OTP");
        message.setText("Your OTP for password reset is: " + otp + "\nValid for 5 minutes.");
        mailSender.send(message);
    }

    public void sendApplicationStatusUpdate(String to, String jobTitle, String newStatus, String applicantName) {
        if (to == null || to.isEmpty()) return;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Update on Your Job Application");

        String body = "Dear " + applicantName + ",\n\n" +
                "Your application for the job '" + jobTitle + "' has been updated to status: " + newStatus + ".\n\n" +
                "Thank you for using our platform.\n\n" +
                "Best regards,\nJobMatcher Team";

        message.setText(body);
        mailSender.send(message);
    }
}