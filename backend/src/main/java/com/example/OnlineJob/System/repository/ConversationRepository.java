package com.example.OnlineJob.System.repository;

import com.example.OnlineJob.System.model.Conversation;
import com.example.OnlineJob.System.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    // For starting a chat (one conversation between two users) – keep if you already use it
    Optional<Conversation> findByJobSeekerAndJobProvider(User jobSeeker, User jobProvider);

    // ALL conversations for a user (job seeker OR job provider)
    @Query("""
        SELECT c FROM Conversation c
        WHERE c.jobSeeker.id = :userId
           OR c.jobProvider.id = :userId
        ORDER BY c.createdAt DESC
        """)
    List<Conversation> findAllByUserId(@Param("userId") Long userId);
}