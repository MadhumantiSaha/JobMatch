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
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserServices {
    private final String UPLOAD_DIR = "uploads/";

    private final PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

//    Constructer Injection
    public UserServices(){
        this.passwordEncoder = new BCryptPasswordEncoder(12);
    }

    private final String imageDir = "register/images/";

//    Save user details
    public User saveUser(User user, MultipartFile img) throws IOException {
        if (img != null && !img.isEmpty()) {
            String imageFileName = saveFile(img, UPLOAD_DIR + "images/");
            user.setImage(imageFileName);
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

//    save updated files
    private String saveFile(MultipartFile file, String directory) throws IOException {
        Path path = Paths.get(directory);
        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }

        String originalFilename = file.getOriginalFilename();
        String fileName = UUID.randomUUID() + "_" + originalFilename;

        Files.copy(file.getInputStream(), path.resolve(fileName),
                StandardCopyOption.REPLACE_EXISTING);

        return fileName;
    }


    // Update method in UserServices.java
    public User updateUser(Long userId,
                           UpdateUserRequest request,
                           MultipartFile image,
                           MultipartFile resume,
                           MultipartFile companyDetails) throws IOException{

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Basic fields
        if (request.getName() != null) user.setName(request.getName());
        if (request.getContact() != null) user.setContact(request.getContact());
        if (request.getEmail() != null) user.setEmail(request.getEmail());

        // Password (only if provided)
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        if (request.getSkills() != null) {
            // Optional: normalize (lowercase, trim, remove empty)
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

        // File updates with consistent paths
        if (image != null && !image.isEmpty()) {
            String imageFileName = saveFile(image, UPLOAD_DIR + "images/");
            user.setImage(imageFileName);
        }

        if (user.getRole() == User.Role.job_seeker) {
            if (resume != null && !resume.isEmpty()) {
                String resumeFileName = saveFile(resume, UPLOAD_DIR + "resumes/");
                user.setResume(resumeFileName);
            }
        }
        else if (user.getRole() == User.Role.job_provider) {
            if (companyDetails != null && !companyDetails.isEmpty()) {
                String companyFileName = saveFile(companyDetails, UPLOAD_DIR + "company/");
                user.setCompanyDetails(companyFileName);
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
