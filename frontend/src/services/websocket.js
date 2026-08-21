import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { WS_URL } from "../config";

let stompClient = null;
let currentConversationId = null;

/**
 * Connects to the chat socket and subscribes to a single conversation's topic.
 * Safe to call again with a new conversationId — it tears down the old
 * subscription/connection first.
 */
export function connectToConversation(conversationId, onMessageReceived, onError) {
  disconnectChat(); // clean up any previous connection

  const token = localStorage.getItem("token");
  currentConversationId = conversationId;

  stompClient = new Client({
    webSocketFactory: () => new SockJS(WS_URL),
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    reconnectDelay: 5000,

    onConnect: () => {
      stompClient.subscribe(
        `/topic/conversation/${conversationId}`,
        (frame) => {
          const message = JSON.parse(frame.body);
          onMessageReceived(message);
        }
      );
    },

    onStompError: (frame) => {
      console.error("STOMP error:", frame.headers["message"], frame.body);
      if (onError) onError(frame.headers["message"]);
    },

    onWebSocketError: (event) => {
      console.error("WebSocket error:", event);
      if (onError) onError("Connection failed");
    },
  });

  stompClient.activate();
}

export function sendChatMessage(content) {
  if (!stompClient || !stompClient.connected || !currentConversationId) {
    console.error("Chat socket not connected");
    return false;
  }

  stompClient.publish({
    destination: `/app/chat.send/${currentConversationId}`,
    body: JSON.stringify({ content }),
  });
  return true;
}

export function disconnectChat() {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
  currentConversationId = null;
}