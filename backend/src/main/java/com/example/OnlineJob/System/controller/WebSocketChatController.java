package com.example.OnlineJob.System.controller;

import com.example.OnlineJob.System.dtos.SendMessageRequest;
import com.example.OnlineJob.System.model.User;
import com.example.OnlineJob.System.service.MessagingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class WebSocketChatController {

    @Autowired
    private MessagingService messagingService;

    @MessageMapping("/chat.send/{conversationId}")
    public void sendMessage(
            @DestinationVariable Long conversationId,
            SendMessageRequest request,
            Principal principal) {

        User sender = (User) ((UsernamePasswordAuthenticationToken) principal).getPrincipal();

        // Service now saves AND broadcasts — no need to do it here too
        messagingService.sendMessage(
                conversationId, sender.getId(), request.getContent()
        );
    }
}