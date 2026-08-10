package com.example.OnlineJob.System.service;

import com.example.OnlineJob.System.model.*;
import com.example.OnlineJob.System.repository.ConversationRepository;
import com.example.OnlineJob.System.repository.MessageRepository;
import com.example.OnlineJob.System.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MessagingService {

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PremiumService premiumService;

    @Autowired
    @Lazy
    private SimpMessagingTemplate messagingTemplate;



    @Transactional
    public Conversation startOrGetConversation(Long currentUserId, Long otherUserId) {

        if (currentUserId.equals(otherUserId)) {
            throw new RuntimeException("Cannot start a conversation with yourself");
        }

        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        User otherUser = userRepository.findById(otherUserId)
                .orElseThrow(() -> new RuntimeException("Recipient not found"));

        User jobSeeker;
        User jobProvider;

        if (currentUser.getRole() == User.Role.job_seeker
                && otherUser.getRole() == User.Role.job_provider) {
            jobSeeker = currentUser;
            jobProvider = otherUser;
        } else if (currentUser.getRole() == User.Role.job_provider
                && otherUser.getRole() == User.Role.job_seeker) {
            jobSeeker = otherUser;
            jobProvider = currentUser;
        } else {
            throw new RuntimeException("Messaging is only allowed between a job seeker and a job provider");
        }

        return conversationRepository.findByJobSeekerAndJobProvider(jobSeeker, jobProvider)
                .orElseGet(() -> openNewConversation(currentUser, jobSeeker, jobProvider));
    }

    private Conversation openNewConversation(User initiator, User jobSeeker, User jobProvider) {

        if (initiator.getRole() == User.Role.job_seeker) {
            // Job seeker is trying to be the one to open the thread — must be premium
            if (!premiumService.isPremium(jobSeeker.getId())) {
                throw new AccessDeniedException(
                        "Only Premium members can initiate conversations."
                );
            }
        }
        // job_provider can always open a thread, regardless of the seeker's plan

        Conversation conversation = new Conversation();
        conversation.setActivated(true);
        conversation.setJobSeeker(jobSeeker);
        conversation.setJobProvider(jobProvider);
        conversation.setInitiatedBy(
                      initiator.getRole()== User.Role.job_seeker ?
                                Conversation.Initiator.SEEKER :
                                Conversation.Initiator.RECRUITER

        );

        return conversationRepository.save(conversation);
    }

    @Transactional
    public Message sendMessage(Long conversationId, Long senderId, String content) {

        if (content == null || content.isBlank()) {
            throw new RuntimeException("Message cannot be empty");
        }

        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        User receiver =
                sender.getId().equals(conversation.getJobSeeker().getId())
                        ? conversation.getJobProvider()
                        : conversation.getJobSeeker();

        boolean isParticipant =
                conversation.getJobSeeker().getId().equals(senderId) ||
                        conversation.getJobProvider().getId().equals(senderId);

        if (!isParticipant) {
            throw new RuntimeException("You are not part of this conversation");
        }

        Message message = new Message();
        message.setConversation(conversation);
        message.setSender(sender);
        message.setContent(content.trim());
        message.setReceiver(receiver);

        Message saved = messageRepository.save(message);

        // Broadcast to everyone subscribed to this conversation's topic
        messagingTemplate.convertAndSend(
                "/topic/conversation/" + conversationId,
                saved
        );

        return saved;
    }

    public List<Message> getMessages(Long conversationId, Long requesterId) {

        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        boolean isParticipant =
                conversation.getJobSeeker().getId().equals(requesterId) ||
                        conversation.getJobProvider().getId().equals(requesterId);

        if (!isParticipant) {
            throw new RuntimeException("You are not part of this conversation");
        }

        return messageRepository.findByConversationOrderBySentAtAsc(conversation);
    }

    public List<Conversation> getMyConversations(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() == User.Role.job_seeker) {
            return conversationRepository.findByJobSeeker(user);
        } else {
            return conversationRepository.findByJobProvider(user);
        }
    }

    public boolean isParticipant(Long conversationId, Long userId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        return conversation.getJobSeeker().getId().equals(userId)
                || conversation.getJobProvider().getId().equals(userId);
    }

    // Unread count for the current user
    public long getUnreadCount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return messageRepository.countByReceiverAndReadFalse(user);
    }

    // Mark all messages in a conversation as read for this user
    @Transactional
    public void markConversationAsRead(Long conversationId, Long userId) {
        messageRepository.markAsRead(conversationId, userId);
    }
}