package com.example.OnlineJob.System.dtos;

import lombok.Data;

@Data
public class ResetPasswordRequest {
    private String email;
    private String password;
}
