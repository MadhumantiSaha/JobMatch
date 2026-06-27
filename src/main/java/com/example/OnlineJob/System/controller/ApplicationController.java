package com.example.OnlineJob.System.controller;

import com.example.OnlineJob.System.model.Application;
import com.example.OnlineJob.System.model.User;
import com.example.OnlineJob.System.service.ApplicationServices;
import com.example.OnlineJob.System.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/application")
@CrossOrigin(origins = "http://localhost:5173")
public class ApplicationController {
    @Autowired
    private ApplicationServices applicationServices;

    @Autowired
    private JwtUtil jwtUtil;

    // Apply to a job
    @PostMapping("/apply/{jobId}")
    public ResponseEntity<Map<String, Object>> applyToJob(
            @PathVariable Long jobId,
            @RequestHeader("Authorization") String authHeader) {

        Map<String, Object> response = new HashMap<>();

        try {
            String token = authHeader.substring(7);
            Long userId = jwtUtil.extractId(token);

            Application application =
                    applicationServices.applyToJob(jobId, userId);

            response.put("success", true);
            response.put("message",
                    "Applied to job successfully.");
            response.put("data", application);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());

            return ResponseEntity.status(
                            HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }

    // Get all jobs applied by the logged-in user for job seekers
    @GetMapping("/my-applications")
    public ResponseEntity<Map<String, Object>> getMyApplications(
            @RequestHeader("Authorization") String authHeader) {

        Map<String, Object> response = new HashMap<>();

        try {
            String token = authHeader.substring(7);
            Long userId = jwtUtil.extractId(token);

            User user = new User();
            user.setId(userId);

            List<Application> applications =
                    applicationServices.getMyApplications(user);

            response.put("success", true);
            response.put("data", applications);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());

            return ResponseEntity.status(
                            HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }

    // job provider sees all applicants for a job
    @GetMapping("/job/{jobId}")
    public ResponseEntity<Map<String, Object>> getApplicationsByJob(
            @PathVariable Long jobId) {

        Map<String, Object> response = new HashMap<>();

        try {
            List<Application> applications =
                    applicationServices.getApplicationsByJob(jobId);

            response.put("success", true);
            response.put("data", applications);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());

            return ResponseEntity.status(
                            HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }

    // Update application status
    @PutMapping("/{applicationId}/status")
    public ResponseEntity<Map<String, Object>> updateStatus(
            @PathVariable Long applicationId,
            @RequestParam Application.ApplicationStatus status) {

        Map<String, Object> response = new HashMap<>();

        try {
            Application application =
                    applicationServices.updateStatus(
                            applicationId,
                            status
                    );

            response.put("success", true);
            response.put("message",
                    "Application status updated.");
            response.put("data", application);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());

            return ResponseEntity.status(
                            HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }

    // Withdraw application
    @DeleteMapping("/{applicationId}")
    public ResponseEntity<Map<String, Object>> withdrawApplication(
            @PathVariable Long applicationId) {

        Map<String, Object> response = new HashMap<>();

        try {
            String message =
                    applicationServices.withdrawApplication(
                            applicationId);

            response.put("success", true);
            response.put("message", message);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());

            return ResponseEntity.status(
                            HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }

    // Count applicants for a job
    @GetMapping("/job/{jobId}/count")
    public ResponseEntity<Map<String, Object>> countApplicants(
            @PathVariable Long jobId) {

        Map<String, Object> response = new HashMap<>();

        try {
            Long count =
                    applicationServices.countApplicants(jobId);

            response.put("success", true);
            response.put("count", count);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());

            return ResponseEntity.status(
                            HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }

}
