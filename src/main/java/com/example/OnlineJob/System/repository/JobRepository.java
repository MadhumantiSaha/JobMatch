package com.example.OnlineJob.System.repository;

import com.example.OnlineJob.System.model.Job;
import com.example.OnlineJob.System.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findJobByUserID(User user);
}
