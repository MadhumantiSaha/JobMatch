package com.example.OnlineJob.System.controller;

import com.example.OnlineJob.System.config.JwtFilter;
import com.example.OnlineJob.System.model.Job;
import com.example.OnlineJob.System.model.User;
import com.example.OnlineJob.System.service.JobServices;
import com.example.OnlineJob.System.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/job")
@CrossOrigin(origins = "http://localhost:5173")
public class JobController {

    @Autowired
    private JobServices jobServices;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private JwtFilter jwtFilter;

    // CREATE
    @PostMapping("/jobpost")
    public ResponseEntity<Map<String, Object>> createJob(
            @RequestBody Job job,
            @RequestHeader("Authorization") String authHeader) {

        Map<String, Object> response = new HashMap<>();

        try {
            // Remove "Bearer " prefix
            String token = authHeader.substring(7);

            // Extract user ID from JWT
            Long userId = jwtUtil.extractId(token);

            // Set user ID in Job
            User u = new User();
            u.setId(userId);
            job.setUserID(u);

            jobServices.addJob(job);

            response.put("success", true);
            response.put("message", "Job created successfully");

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {

            response.put("success", false);
            response.put("error", e.getMessage());

            Job savedJob = jobServices.addJob(job);

            System.out.println(savedJob.getId());
            System.out.println(savedJob.getPostName());
            System.out.println(savedJob.getJobType());

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // FILTER JOBS
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchJobs(String keyword){

        Map<String, Object> response = new HashMap<>();

        try {
            List<Job> jobs = jobServices.searchJobs(keyword);

            response.put("success", true);
            response.put("data", jobs);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Pagination
    @GetMapping
    public ResponseEntity<Page<Job>> getJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size) {

        return ResponseEntity.ok(
                jobServices.getJobs(page, size)
        );
    }

    // READ ALL
//    @GetMapping
//    public ResponseEntity<Map<String, Object>> getAllJobs() {
//
//        Map<String, Object> response = new HashMap<>();
//
//        try {
//            List<Job> jobs = jobServices.getAllJobs();
//
//            response.put("success", true);
//            response.put("data", jobs);
//
//            return new ResponseEntity<>(response, HttpStatus.OK);
//
//        } catch (Exception e) {
//
//            response.put("success", false);
//            response.put("error", e.getMessage());
//
//            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }

// READ BY JOB ID
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getJobById(@PathVariable Long id) {

        Map<String, Object> response = new HashMap<>();

        try {
            Job job = jobServices.getJobById(id);

            response.put("success", true);
            response.put("data", job);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

//  READ BY USER ID
    @GetMapping("/my-jobs")
    public ResponseEntity<?> getMyJobs( @RequestHeader("Authorization") String authHeader) {

        Map<String, Object> response = new HashMap<>();

        try {
            String token = authHeader.substring(7);
            Long id = jwtUtil.extractId(token);
            System.out.println("Id: "+id);
            User u = new User();
            u.setId(id);

            List<Job> jobs = jobServices.getJobsByUserId(u);
            response.put("success", true);
            response.put("data", jobs);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // UPDATE
    @PutMapping()
    public ResponseEntity<Map<String, Object>> updateJob(
            @RequestBody Job job) {

        Map<String, Object> response = new HashMap<>();

        try {
            Job updatedJob = jobServices.updateJob(job);

            response.put("success", true);
            response.put("message", "Job updated successfully");
            response.put("data", updatedJob);

            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (Exception e) {

            response.put("success", false);
            response.put("error", e.getMessage());

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteJob(@PathVariable Long id) {

        Map<String, Object> response = new HashMap<>();

        try {
            String message = jobServices.deleteJob(id);

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