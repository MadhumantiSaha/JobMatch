package com.example.OnlineJob.System.controller;

import com.example.OnlineJob.System.service.PremiumJobAlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
public class TestController {

    @Autowired
    private PremiumJobAlertService premiumJobAlertService;

    @GetMapping("/premium-reminder")
    public String testReminder() {
        premiumJobAlertService.sendPremiumEndAlert();
        return "Reminder sent";
    }
}