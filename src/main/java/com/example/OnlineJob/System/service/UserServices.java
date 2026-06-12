package com.example.OnlineJob.System.service;

import com.example.OnlineJob.System.model.User;
import com.example.OnlineJob.System.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.autoconfigure.WebMvcProperties;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServices {

    private final PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

//    Constructer Injection
    public UserServices(){
        this.passwordEncoder = new BCryptPasswordEncoder(12);
    }

//    Create - with password encryption
    public User saveUser(User user){
        if(user.getPassword() != null && !user.getPassword().isEmpty()){
            String encodedPassword = passwordEncoder.encode(user.getPassword());
            user.setPassword(encodedPassword);
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
    public User findUserByEmail(String email){
        return userRepository.findUserByEmail(email);
    }

//    UPDATE
    public User updateUser(Long id, User updateUser){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (updateUser.getName() != null){
            user.setName(updateUser.getName());
        }
        if (updateUser.getContact() != null) {
            user.setContact(updateUser.getContact());
        }
        if (updateUser.getEmail() != null){
            user.setEmail(updateUser.getEmail());
        }
        if (updateUser.getRole() != null) {
            user.setRole(updateUser.getRole());
        }
        if (updateUser.getPassword() != null && !updateUser.getPassword().isEmpty()) {
            String encodedPassword = passwordEncoder.encode(updateUser.getPassword());
            user.setPassword(encodedPassword);
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
