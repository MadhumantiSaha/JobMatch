package com.example.OnlineJob.System.dtos;

import lombok.Data;

@Data
public class OTPRequest {
    private String email;
    private String otp;
}
