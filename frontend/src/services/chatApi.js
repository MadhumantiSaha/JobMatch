import axios from "axios";
import { API_BASE_URL } from "../config";

const BASE_URL = API_BASE_URL;

function authHeader() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

// Opens (or fetches existing) conversation with another user.
// Throws on 403 if a non-premium seeker tries to initiate first.
export async function startConversation(otherUserId) {
  const res = await axios.post(
    `${BASE_URL}/messages/start/${otherUserId}`,
    {},
    { headers: authHeader() }
  );
  return res.data.data; // Conversation object
}

export async function getMessages(conversationId) {
  const res = await axios.get(
    `${BASE_URL}/messages/conversation/${conversationId}`,
    { headers: authHeader() }
  );
  return res.data.data; // List<Message>
}

export async function getMyConversations() {
  const res = await axios.get(`${BASE_URL}/messages/my-conversations`, {
    headers: authHeader(),
  });
  return res.data.data; // List<Conversation>
}

// REST fallback for sending (WebSocket is the primary path — see websocket.js)
export async function sendMessageRest(conversationId, content) {
  const res = await axios.post(
    `${BASE_URL}/messages/send/${conversationId}`,
    { content },
    { headers: authHeader() }
  );
  return res.data.data;
}