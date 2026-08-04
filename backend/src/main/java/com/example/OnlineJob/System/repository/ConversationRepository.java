package com.example.OnlineJob.System.repository;

import com.example.OnlineJob.System.model.Application;
import com.example.OnlineJob.System.model.Conversation;
import com.example.OnlineJob.System.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    Optional<Conversation> findByJobSeekerAndJobProvider(User jobSeeker, User jobProvider);

    List<Conversation> findByJobSeeker(User jobSeeker);

    List<Conversation> findByJobProvider(User jobProvider);

//    Optional<Conversation> findByApplication(Application application);

}
