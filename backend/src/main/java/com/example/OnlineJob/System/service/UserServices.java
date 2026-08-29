package com.example.OnlineJob.System.service;

import com.example.OnlineJob.System.dtos.UpdateUserRequest;
import com.example.OnlineJob.System.model.User;
import com.example.OnlineJob.System.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserServices {

    private final PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ResumeParserService resumeParserService;

    @Autowired
    private S3StorageService s3StorageService;

    //    Constructer Injection
    public UserServices(){
        this.passwordEncoder = new BCryptPasswordEncoder(12);
    }


    //    Save user details
    public User saveUser(User user, MultipartFile img) throws IOException {
        if (img != null && !img.isEmpty()) {
            String imageKey = s3StorageService.upload(img, "uploads/images");
            user.setImage(imageKey);
        }

        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        return userRepository.save(user);
    }

    //    READ ALL
    public List<User> getAllUser(){
        return userRepository.findAll();
    }
    //    READ BY ID
    public Optional<User> getUserById(Long id){
        return userRepository.findById(id);
    }

    public Optional<User> findUserByEmail(String email){
        return userRepository.findUserByEmail(email);
    }

    public User save(User user){
        return userRepository.save(user);
    }

    // Update method in UserServices.java
    public User updateUser(Long userId,
                           UpdateUserRequest request,
                           MultipartFile image,
                           MultipartFile resume,
                           MultipartFile companyDetails) throws IOException {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Basic fields (same as before)
        if (request.getName() != null) user.setName(request.getName());
        if (request.getContact() != null) user.setContact(request.getContact());
        if (request.getEmail() != null) user.setEmail(request.getEmail());

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        // Manual skills still supported (optional)
        if (request.getSkills() != null) {
            Set<String> cleanedSkills = request.getSkills().stream()
                    .filter(s -> s != null && !s.isBlank())
                    .map(String::trim)
                    .map(String::toLowerCase)
                    .collect(Collectors.toSet());
            user.setSkills(cleanedSkills);
        }

        if (request.getExperienceYears() != null) {
            if (request.getExperienceYears() < 0 || request.getExperienceYears() > 50) {
                throw new IllegalArgumentException("Experience years must be between 0 and 50");
            }
            user.setExperienceYears(request.getExperienceYears());
        }

        // Image
        if (image != null && !image.isEmpty()) {
            String imageKey = s3StorageService.upload(image, "uploads/images");
            user.setImage(imageKey);
        }

        // ===== RESUME + AUTO SKILL EXTRACTION =====
        if (user.getRole() == User.Role.job_seeker) {
            if (resume != null && !resume.isEmpty()) {
                // 1. Upload to S3
                String resumeKey = s3StorageService.upload(resume, "uploads/resumes");
                user.setResume(resumeKey);

                // 2. Extract skills automatically and store them
                //    (unchanged — still parses the MultipartFile directly, before/independent
                //    of the S3 upload)
                try {
                    Set<String> extractedSkills = resumeParserService.extractSkills(resume);
                    user.setSkills(extractedSkills);   // ← overwrites / sets skills
                    System.out.println("Extracted skills: " + extractedSkills);
                } catch (Exception e) {
                    // Don't fail the whole update if AI fails
                    System.err.println("Skill extraction failed: " + e.getMessage());
                }
            }
        }
        else if (user.getRole() == User.Role.job_provider) {
            if (companyDetails != null && !companyDetails.isEmpty()) {
                String companyKey = s3StorageService.upload(companyDetails, "uploads/company");
                user.setCompanyDetails(companyKey);
            }
        }

        return userRepository.save(user);
    }


    //    DELETE
    public void deleteUser(Long id){
        userRepository.deleteById(id);
    }
    //    OPTIONAL:Helper for login
    public boolean verifyPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
}