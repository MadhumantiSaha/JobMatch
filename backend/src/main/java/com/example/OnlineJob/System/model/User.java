package com.example.OnlineJob.System.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;


@Entity
public class User {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   private String name;

   private String contact;

   @Column(unique = true, nullable = false)
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

   @OneToMany(mappedBy = "jobSeeker", fetch = FetchType.LAZY)
   @JsonManagedReference("user-application")
   @ToString.Exclude
   @EqualsAndHashCode.Exclude
   private List<Application> applications;

   private String otp;

   private LocalDateTime otpExpiry;

   public Long getId() {
      return id;
   }

   public void setId(Long id) {
      this.id = id;
   }

   public String getName() {
      return name;
   }

   public void setName(String name) {
      this.name = name;
   }

   public String getContact() {
      return contact;
   }

   public void setContact(String contact) {
      this.contact = contact;
   }

   public String getEmail() {
      return email;
   }

   public void setEmail(String email) {
      this.email = email;
   }

   public String getPassword() {
      return password;
   }

   public void setPassword(String password) {
      this.password = password;
   }

   public Role getRole() {
      return role;
   }

   public void setRole(Role role) {
      this.role = role;
   }

   public String getImage() {
      return image;
   }

   public void setImage(String image) {
      this.image = image;
   }

   public String getResume() {
      return resume;
   }

   public void setResume(String resume) {
      this.resume = resume;
   }

   public String getCompanyDetails() {
      return companyDetails;
   }

   public void setCompanyDetails(String companyDetails) {
      this.companyDetails = companyDetails;
   }

   public List<Application> getApplications() {
      return applications;
   }

   public void setApplications(List<Application> applications) {
      this.applications = applications;
   }

   public String getOtp() {
      return otp;
   }

   public void setOtp(String otp) {
      this.otp = otp;
   }

   public LocalDateTime getOtpExpiry() {
      return otpExpiry;
   }

   public void setOtpExpiry(LocalDateTime otpExpiry) {
      this.otpExpiry = otpExpiry;
   }
}