package com.example.OnlineJob.System.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Entity
@Data
public class User {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   private String name;

   private String contact;

   private String email;

   private String password;

   @Enumerated(EnumType.STRING)
   private Role role;

   public enum Role {
      job_seeker,
      job_provider
   }

   private String image;

   private String resume;

   private String companyDetails;

   @OneToMany(mappedBy = "jobSeeker")
   @JsonManagedReference("user-application")
   private List<Application> applications;

   private String otp;
   private LocalDateTime otpExpiry;
}
