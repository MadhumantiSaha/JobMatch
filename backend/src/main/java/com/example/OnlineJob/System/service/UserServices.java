package com.example.OnlineJob.System.service;

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
import java.util.UUID;

@Service
public class UserServices {

    private final PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

//    Constructer Injection
    public UserServices(){
        this.passwordEncoder = new BCryptPasswordEncoder(12);
    }

    private final String imageDir = "register/images/";
//    private final String resumeDir = "register/resumes/";
//    private final String companyDir = "register/company/";


 //    Create - with password encryption

    public User saveUser(User user, MultipartFile img) throws IOException {

        Path path = Paths.get(imageDir);

        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }

        if (img != null && !img.isEmpty()) {
            String fileName = img.getOriginalFilename();

            Files.copy(
                    img.getInputStream(),
                    path.resolve(fileName),
                    StandardCopyOption.REPLACE_EXISTING
            );

            user.setImage(fileName);
        }

        // Encrypt password BEFORE saving
        if (user.getPassword() != null &&
                !user.getPassword().isEmpty()) {

            user.setPassword(
                    passwordEncoder.encode(user.getPassword())
            );
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

//    READ BY ID - Login
//    public Optional<User> findUserByEmail(String email){
//        return userRepository.findUserByEmail(email);
//    }
//
//    public User save(User user) {
//        return userRepository.save(user);
//    }

    public Optional<User> findUserByEmail(String email){
        return userRepository.findUserByEmail(email);
    }

    public User save(User user){
        return userRepository.save(user);
    }

//    UPDATE
    private String saveFile(MultipartFile file,
                            String directory)
            throws IOException {

        Path path = Paths.get(directory);

        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }

        String fileName =
                UUID.randomUUID() + "_"
                        + file.getOriginalFilename();

        Files.copy(
                file.getInputStream(),
                path.resolve(fileName),
                StandardCopyOption.REPLACE_EXISTING
        );

        return fileName;
    }

//    Update
    public User updateUser(
            User updateUser,
            MultipartFile image,
            MultipartFile resume,
            MultipartFile companyDetails) throws IOException {

        User user = userRepository.findById(updateUser.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update other fields
        if (updateUser.getName() != null) {
            user.setName(updateUser.getName());
        }

        if (updateUser.getContact() != null) {
            user.setContact(updateUser.getContact());
        }

        if (updateUser.getEmail() != null) {
            user.setEmail(updateUser.getEmail());
        }

        if (updateUser.getPassword() != null &&
                !updateUser.getPassword().isEmpty()) {
            user.setPassword(
                    passwordEncoder.encode(updateUser.getPassword())
            );
        }

        // Update image
        if (image != null && !image.isEmpty()) {
            // save image
            user.setImage(saveFile(image, "/update"));
        }

        // Role-based updates
        if (user.getRole() == User.Role.job_seeker) {

            if (resume != null && !resume.isEmpty()) {
                user.setResume(
                        saveFile(resume, "uploads/resumes")
                );
            }

            // Prevent job seekers from updating company details
            if (companyDetails != null && !companyDetails.isEmpty()) {
                throw new RuntimeException(
                        "Job seekers cannot upload company details."
                );
            }
        }

        if (user.getRole() == User.Role.job_provider) {

            if (companyDetails != null && !companyDetails.isEmpty()) {
                user.setCompanyDetails(
                        saveFile(companyDetails,
                                "uploads/companyDetails")
                );
            }

            // Prevent job providers from uploading resumes
            if (resume != null && !resume.isEmpty()) {
                throw new RuntimeException(
                        "Job providers cannot upload resumes."
                );
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
