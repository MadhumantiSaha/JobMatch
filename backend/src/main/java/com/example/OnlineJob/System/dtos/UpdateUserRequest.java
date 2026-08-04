package com.example.OnlineJob.System.dtos;

import lombok.Data;

import java.util.Set;


@Data
public class UpdateUserRequest {

    private String name;
    private String contact;
    private String email;

    // New fields for your feature
    private Set<String> skills;
    private Integer experienceYears;

    // Optional: only if you still want password change in the same API
    private String password;
}