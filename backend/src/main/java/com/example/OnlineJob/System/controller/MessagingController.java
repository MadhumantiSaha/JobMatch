package com.example.OnlineJob.System.controller;

import com.example.OnlineJob.System.dtos.SendMessageRequest;
import com.example.OnlineJob.System.model.Conversation;
import com.example.OnlineJob.System.model.Message;
import com.example.OnlineJob.System.service.MessagingService;
import com.example.OnlineJob.System.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/messages")
@CrossOrigin(origins = "http://localhost:5173")
public class MessagingController {
    @Autowired
    private MessagingService messagingService;

    @Autowired
    private JwtUtil jwtUtil;

    // Open (or fetch) a conversation with another user
    @PostMapping("/start/{otherUserId}")
    public ResponseEntity<Map<String, Object>> startConversation(
            @PathVariable Long otherUserId,
            @RequestHeader("Authorization") String authHeader) {

        Map<String, Object> response = new HashMap<>();

        try {
            Long userId = jwtUtil.extractId(authHeader.substring(7));

            Conversation conversation =
                    messagingService.startOrGetConversation(userId, otherUserId);

            response.put("success", true);
            response.put("data", conversation);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());

            // 403 specifically communicates "blocked by premium rule" to the frontend
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
    }

    @PostMapping("/send/{conversationId}")
    public ResponseEntity<Map<String, Object>> sendMessage(
            @PathVariable Long conversationId,
            @RequestBody SendMessageRequest request,
            @RequestHeader("Authorization") String authHeader) {

        Map<String, Object> response = new HashMap<>();

        try {
            Long userId = jwtUtil.extractId(authHeader.substring(7));

            Message message = messagingService.sendMessage(
                    conversationId, userId, request.getContent());

            response.put("success", true);
            response.put("data", message);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping("/conversation/{conversationId}")
    public ResponseEntity<Map<String, Object>> getMessages(
            @PathVariable Long conversationId,
            @RequestHeader("Authorization") String authHeader) {

        Map<String, Object> response = new HashMap<>();

        try {
            Long userId = jwtUtil.extractId(authHeader.substring(7));

            List<Message> messages = messagingService.getMessages(conversationId, userId);

            response.put("success", true);
            response.put("data", messages);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());

            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
    }

    @GetMapping("/my-conversations")
    public ResponseEntity<Map<String, Object>> getMyConversations(
            @RequestHeader("Authorization") String authHeader) {

        Map<String, Object> response = new HashMap<>();

        try {
            Long userId = jwtUtil.extractId(authHeader.substring(7));

            List<Conversation> conversations = messagingService.getMyConversations(userId);

            response.put("success", true);
            response.put("data", conversations);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
