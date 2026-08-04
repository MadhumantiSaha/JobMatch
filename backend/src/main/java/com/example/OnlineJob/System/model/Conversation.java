package com.example.OnlineJob.System.model;

import jakarta.persistence.*;
import lombok.Getter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Getter
@Entity
public class Conversation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

//    @OneToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "application_id", unique = true)
//    private Application application;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_seeker_id")
    private User jobSeeker;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_provider_id")
    private User jobProvider;

    private boolean activated;

//    @Column(length = 500)
//    private String lastMessage;
//
//    private LocalDateTime lastMessageTime;

    @Enumerated(EnumType.STRING)
    private Initiator initiatedBy;

    public enum Initiator{
        SEEKER,
        RECRUITER
    }

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public void setId(Long id) {
        this.id = id;
    }

    public void setJobSeeker(User jobSeeker) {
        this.jobSeeker = jobSeeker;
    }

    public void setJobProvider(User jobProvider) {
        this.jobProvider = jobProvider;
    }

    public void setInitiatedBy(Initiator initiatedBy) {
        this.initiatedBy = initiatedBy;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setActivated(boolean activated) {
        this.activated = activated;
    }


    public Long getId() {
        return id;
    }

    public User getJobSeeker() {
        return jobSeeker;
    }

    public User getJobProvider() {
        return jobProvider;
    }

    public boolean isActivated() {
        return activated;
    }

    public Initiator getInitiatedBy() {
        return initiatedBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
