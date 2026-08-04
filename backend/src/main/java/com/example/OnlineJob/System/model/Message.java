package com.example.OnlineJob.System.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
public class Message {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "conversation_id")
        private Conversation conversation;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "sender_id")
        private User sender;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "receiver_id")
        private User receiver;

        @Column(nullable = false, length = 2000)
        private String content;

        @Column(name = "is_read")
        private boolean read = false;

        @CreationTimestamp
        private LocalDateTime sentAt;


        public Long getId() {
                return id;
        }

        public void setId(Long id) {
                this.id = id;
        }

        public Conversation getConversation() {
                return conversation;
        }

        public void setConversation(Conversation conversation) {
                this.conversation = conversation;
        }

        public User getSender() {
                return sender;
        }

        public void setSender(User sender) {
                this.sender = sender;
        }

        public User getReceiver() {
                return receiver;
        }

        public void setReceiver(User receiver) {
                this.receiver = receiver;
        }

        public String getContent() {
                return content;
        }

        public void setContent(String content) {
                this.content = content;
        }

        public boolean isRead() {
                return read;
        }

        public void setRead(boolean read) {
                this.read = read;
        }

        public LocalDateTime getSentAt() {
                return sentAt;
        }

        public void setSentAt(LocalDateTime sentAt) {
                this.sentAt = sentAt;
        }
}
