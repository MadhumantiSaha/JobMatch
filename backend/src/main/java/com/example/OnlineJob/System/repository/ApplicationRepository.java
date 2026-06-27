package com.example.OnlineJob.System.repository;

import com.example.OnlineJob.System.model.Application;
import com.example.OnlineJob.System.model.Job;
import com.example.OnlineJob.System.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByJobSeeker(User user);

    List<Application> findByJob(Job job);

    boolean existsByJobAndJobSeeker(Job job, User user);
}
