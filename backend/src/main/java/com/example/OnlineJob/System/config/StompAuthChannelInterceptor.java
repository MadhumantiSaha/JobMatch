package com.example.OnlineJob.System.config;

import com.example.OnlineJob.System.model.User;
import com.example.OnlineJob.System.service.MessagingService;
import com.example.OnlineJob.System.service.UserServices;
import com.example.OnlineJob.System.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.security.Principal;
import java.util.List;

@Component
public class StompAuthChannelInterceptor implements ChannelInterceptor {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserServices userServices;

    @Autowired
    private MessagingService messagingService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {

        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor == null) return message;

        // ---- Authenticate on CONNECT ----
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {

            String authHeader = accessor.getFirstNativeHeader("Authorization");

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                throw new IllegalArgumentException("Missing or invalid Authorization header");
            }

            String token = authHeader.substring(7);
            Long userId = jwtUtil.extractId(token); // throws if invalid/expired

            User user = userServices.getUserById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            Principal principal = new UsernamePasswordAuthenticationToken(
                    user,
                    null,
                    List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
            );

            accessor.setUser(principal);
        }

        // ---- Authorize on SUBSCRIBE: only conversation participants can listen ----
        if (StompCommand.SUBSCRIBE.equals(accessor.getCommand())) {

            String destination = accessor.getDestination(); // e.g. /topic/conversation/12
            Principal principal = accessor.getUser();

            if (destination != null && destination.startsWith("/topic/conversation/") && principal != null) {

                Long conversationId = Long.parseLong(
                        destination.substring(destination.lastIndexOf('/') + 1)
                );

                User user = (User) ((UsernamePasswordAuthenticationToken) principal).getPrincipal();

                if (!messagingService.isParticipant(conversationId, user.getId())) {
                    throw new IllegalArgumentException("Not authorized to join this conversation");
                }
            }
        }

        return message;
    }
}
