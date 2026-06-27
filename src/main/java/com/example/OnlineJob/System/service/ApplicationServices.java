package com.example.OnlineJob.System.service;

import com.example.OnlineJob.System.model.Application;
import com.example.OnlineJob.System.model.User;
import com.example.OnlineJob.System.repository.ApplicationRepository;
import org.springframework.stereotype.Service;

import com.example.OnlineJob.System.model.Job;
import com.example.OnlineJob.System.repository.JobRepository;
import com.example.OnlineJob.System.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;


@Service
public class ApplicationServices {
    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public ApplicationServices(ApplicationRepository applicationRepository,
                               JobRepository jobRepository,
                               UserRepository userRepository) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    // Apply to a job
    public Application applyToJob(Long jobId, Long userId) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException("Job not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // Prevent duplicate applications
        if (applicationRepository.existsByJobAndJobSeeker(job, user)) {
            throw new RuntimeException(
                    "You have already applied for this job.");
        }

        Application application = new Application();
        application.setJob(job);
        application.setJobSeeker(user);
        application.setStatus(Application.ApplicationStatus.PENDING);
        application.setAppliedAt(LocalDateTime.now());

        return applicationRepository.save(application);
    }

    // Get all applications of a job seeker
    public List<Application> getMyApplications(User user) {
        return applicationRepository.findByJobSeeker(user);
    }

    // Get all applicants for a job
    public List<Application> getApplicationsByJob(Long jobId) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException("Job not found"));

        return applicationRepository.findByJob(job);
    }

    // Update application status
    public Application updateStatus(Long applicationId,
                                    Application.ApplicationStatus status) {

        Application application =
                applicationRepository.findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found"));

        application.setStatus(status);

        return applicationRepository.save(application);
    }

    // Withdraw application
    public String withdrawApplication(Long applicationId) {

        Application application =
                applicationRepository.findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found"));

        applicationRepository.delete(application);

        return "Application withdrawn successfully.";
    }

    // Count applicants for a job
    public Long countApplicants(Long jobId) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException("Job not found"));

        return (long) applicationRepository.findByJob(job).size();
    }
}
