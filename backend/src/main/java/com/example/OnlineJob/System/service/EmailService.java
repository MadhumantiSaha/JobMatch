package com.example.OnlineJob.System.service;

import com.example.OnlineJob.System.model.Job;
import com.example.OnlineJob.System.model.Premium;
import com.example.OnlineJob.System.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;


    public void sendOtp(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Password Reset OTP");
        message.setText("Your OTP for password reset is: " + otp + "\nValid for 5 minutes.");
        mailSender.send(message);
    }

    public void sendApplicationStatusUpdate(String toEmail, String jobTitle, String newStatus, String applicantName) {
        if (toEmail == null || toEmail.isEmpty()) return;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Update on Your Job Application");

        String body = "Dear " + applicantName + ",\n\n" +
                "Your application for the job '" + jobTitle + "' has been updated to status: " + newStatus + ".\n\n" +
                "Thank you for using our platform.\n\n" +
                "Best regards,\nJobMatcher Team";

        message.setText(body);
        mailSender.send(message);
    }

    public void sendPremiumEmail(String toEmail, String userName, String action, String endDate) {
        if (toEmail == null || toEmail.isEmpty()) return;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Premium Membership Update - JobMatch");

        String body = "Hi " + userName + ",\n\n" +
                "Your premium plan has been successfully " + action.toLowerCase() + "!\n\n" +
                "Valid till: " + endDate + "\n\n" +
                "Thank you for choosing JobMatch Premium!\n\n" +
                "Regards,\nJobMatch Team";

        message.setText(body);
        mailSender.send(message);
    }

    public void sendPremiumDeactivationEmail(String toEmail, String userName) {
        if (toEmail == null || toEmail.isEmpty()) return;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Premium Membership Deactivated - JobMatch");

        String body = "Hi " + userName + ",\n\n" +
                "Your premium plan has been deactivated.\n\n" +
                "You can re-activate anytime by purchasing a new plan.\n\n" +
                "Regards,\nJobMatch Team";

        message.setText(body);
        mailSender.send(message);
    }

    public void sendJobDigest(User user, List<Job> jobs) {
        if (user.getEmail() == null || jobs == null || jobs.isEmpty()) {
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject("🎯 Your Tailored Job Updates (Last 4 Days)");

            StringBuilder body = new StringBuilder();
            body.append("Hi ").append(user.getName() != null ? user.getName() : "there").append(",\n\n");
            body.append("Here are the latest jobs matching your skills:\n\n");

            int count = 1;
            for (Job job : jobs) {
                body.append(count++).append(". ").append(job.getPostName()).append("\n");
                body.append("   Location : ").append(job.getLocation() != null ? job.getLocation() : "N/A").append("\n");
                body.append("   Salary   : ₹").append(job.getSalary() != null ? job.getSalary() : "N/A").append("\n");
                body.append("   Skills   : ").append(job.getSkills() != null ? job.getSkills() : "N/A").append("\n");
                body.append("   Type     : ").append(job.getJobType() != null ? job.getJobType() : "N/A").append("\n");
                body.append("\n");
            }

            body.append("Login to apply → http://localhost:5173\n\n");
            body.append("Best regards,\n");
            body.append("Online Job System Team");

            message.setText(body.toString());
            mailSender.send(message);

            System.out.println("Job digest sent to: " + user.getEmail() + " (" + jobs.size() + " jobs)");

        } catch (Exception e) {
            System.err.println("Failed to send email to " + user.getEmail() + " → " + e.getMessage());
        }
    }

    public void sendPremiumEndAlert(String to, User user) {

        try {

            SimpleMailMessage message = new SimpleMailMessage();

            message.setTo(to);
            message.setSubject("Your Premium Membership is Ending Soon");

            message.setText(
                    "Hi " + user.getName() + ",\n\n" +
                            "Your premium membership will expire in 5 days (" +
                            user.getPremiumExpiry() + ").\n\n" +
                            "Renew your membership now to continue enjoying premium features.\n\n" +
                            "Regards,\n" +
                            "Online Job Portal"
            );

            mailSender.send(message);

        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }

}