package com.example.OnlineJob.System.repository;

import com.example.OnlineJob.System.model.Conversation;
import com.example.OnlineJob.System.model.Message;
import com.example.OnlineJob.System.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByConversationOrderBySentAtAsc(Conversation conversation);

    long countByReceiverAndReadFalse(User receiver);

    @Modifying
    @Query("""
    UPDATE Message m
    SET m.read = true
    WHERE m.conversation.id = :conversationId
      AND m.receiver.id = :userId
      AND m.read = false
    """)
    int markAsRead(@Param("conversationId") Long conversationId,
                   @Param("userId") Long userId);
}