package com.example.OnlineJob.System.service;

import com.example.OnlineJob.System.model.Application;
import com.example.OnlineJob.System.model.User;
import com.example.OnlineJob.System.repository.ApplicationRepository;
import org.springframework.stereotype.Service;

import com.example.OnlineJob.System.model.Job;
import com.example.OnlineJob.System.repository.JobRepository;
import com.example.OnlineJob.System.repository.UserRepository;
import com.example.OnlineJob.System.service.EmailService;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;


@Service
public class ApplicationServices {
    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public ApplicationServices(ApplicationRepository applicationRepository,
                               JobRepository jobRepository,
                               UserRepository userRepository,
                               EmailService emailService) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    private final String UPLOAD_DIR = "application resumes/";

    private String saveResumeFile(MultipartFile file) throws IOException {
        String directory = "applications/resumes/";
        Path path = Paths.get(directory);

        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }

        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

        Files.copy(
                file.getInputStream(),
                path.resolve(fileName),
                StandardCopyOption.REPLACE_EXISTING
        );

        return fileName;
    }

    // Apply to a job - now supports resume upload
    public Application applyToJob(Long jobId, Long userId, MultipartFile resumeFile) throws IOException {

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

        application.setName(user.getName());
        application.setEmail(user.getEmail());
        application.setContact(user.getContact());

        // Handle resume upload (priority to uploaded resume, fallback to user's resume)
        if (resumeFile != null && !resumeFile.isEmpty()) {
            String resumeFileName = saveResumeFile(resumeFile);
            application.setResume(resumeFileName);
        } else {
            application.setResume(user.getResume());
        }

        application.setStatus(Application.ApplicationStatus.PENDING);
        application.setAppliedAt(LocalDateTime.now());

        return applicationRepository.save(application);

    }


    // UPDATE APPLICATION STATUS + SEND EMAIL
    public Application updateStatus(Long applicationId, Application.ApplicationStatus status) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        application.setStatus(status);
        Application savedApplication = applicationRepository.save(application);

        // Send email notification
        if (savedApplication.getJobSeeker() != null &&
                savedApplication.getJobSeeker().getEmail() != null) {

            String jobTitle = (savedApplication.getJob() != null)
                    ? "Job ID: " + savedApplication.getJob().getId()
                    : "the position";

            emailService.sendApplicationStatusUpdate(
                    savedApplication.getJobSeeker().getEmail(),
                    jobTitle,
                    status.name(),
                    savedApplication.getName() != null
                            ? savedApplication.getName()
                            : savedApplication.getJobSeeker().getName()
            );
        }

        return savedApplication;
    }

    // Get all applications of a jobSeeker
    public List<Application> getMyApplications(User user) {
        return applicationRepository.findByJobSeeker(user);
    }

    // Get all applicants for a job
    public List<Application> getApplicationsByJob(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        return applicationRepository.findByJob(job);
    }

    // Withdraw application
    public String withdrawApplication(Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        applicationRepository.delete(application);
        return "Application withdrawn successfully.";
    }

    // Count applicants
    public Long countApplicants(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        return (long) applicationRepository.findByJob(job).size();
    }
}
