package com.example.OnlineJob.System;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class OnlineJobSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(OnlineJobSystemApplication.class, args);
	}
}
