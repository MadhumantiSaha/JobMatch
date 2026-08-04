package com.example.OnlineJob.System.repository;

import com.example.OnlineJob.System.model.Conversation;
import com.example.OnlineJob.System.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByConversationOrderBySentAtAsc(Conversation conversation);
}