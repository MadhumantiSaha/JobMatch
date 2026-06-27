package com.example.OnlineJob.System.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Application{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "job_seeker_id")
    @JsonBackReference("user-application")
    private User jobSeeker;

    @ManyToOne
    @JoinColumn(name = "job_id")
    @JsonBackReference("job-application")
    private Job job;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;

    public enum ApplicationStatus {
        PENDING,
        SHORTLISTED,
        INTERVIEW,
        REJECTED,
        HIRED
    }

    private LocalDateTime appliedAt;
}
