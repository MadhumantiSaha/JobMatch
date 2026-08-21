import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/navbar";
import { API_BASE_URL } from "../config";

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [content, setContent] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserId = currentUser?.id;

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const pollRef = useRef(null);

  useEffect(() => {
    fetchConversations();
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  useEffect(() => {
    const cid = searchParams.get("conversationId");
    if (cid) {
      const id = Number(cid);
      if (!Number.isNaN(id)) {
        setSelectedId(id);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedId) {
      loadMessages(selectedId);
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = setInterval(() => loadMessages(selectedId, true), 4000);
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [selectedId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    fetchConversations();
    const listPoll = setInterval(fetchConversations, 15000); // every 15s
    return () => {
      clearInterval(listPoll);
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const authHeaders = () => ({
    headers: { Authorization: `Bearer ${token}` },
  });

  const fetchConversations = async () => {
    try {
      setLoadingList(true);
      const res = await axios.get(
        `${API_BASE_URL}/messages/my-conversations`,
        authHeaders()
      );
      setConversations(res.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load conversations.");
    } finally {
      setLoadingList(false);
    }
  };

  const loadMessages = async (conversationId, silent = false) => {
    try {
      if (!silent) setLoadingChat(true);

      const res = await axios.get(
        `${API_BASE_URL}/messages/conversation/${conversationId}`,
        authHeaders()
      );

      setMessages(res.data.data || []);
      setError("");

      // Clear unread badge for this conversation locally
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId ? { ...c, unreadCount: 0 } : c
        )
      );

      // Refresh navbar total unread badge
      window.dispatchEvent(new Event("messages-read"));
    } catch (err) {
      console.error(err);
      if (!silent) {
        setError(err.response?.data?.error || "Failed to load messages.");
      }
    } finally {
      if (!silent) setLoadingChat(false);
    }
  };

  const selectConversation = (id) => {
    setSelectedId(id);
    navigate(`/messages?conversationId=${id}`, { replace: true });
  };

  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!content.trim() || !selectedId || sending) return;

    try {
      setSending(true);
      await axios.post(
        `${API_BASE_URL}/messages/send/${selectedId}`,
        { content: content.trim() },
        authHeaders()
      );
      setContent("");
      await loadMessages(selectedId, true);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  const otherParty = (conversation) => {
    if (!conversation) return null;
    if (role === "job_seeker") {
      return conversation.jobProvider;
    }
    return conversation.jobSeeker;
  };

  const selectedConversation = conversations.find((c) => c.id === selectedId);
  const peer = otherParty(selectedConversation);

  return (
    <>
      <Navbar />
      <div className="messages-page">
        <div className="messages-shell">
          {/* Sidebar */}
          <aside className="messages-sidebar">
            <div className="messages-sidebar-header">
              <h2>Messages</h2>
              <button
                className="btn-icon-refresh"
                onClick={fetchConversations}
                title="Refresh"
              >
                ↻
              </button>
            </div>

            {loadingList ? (
              <div className="messages-empty-side">Loading...</div>
            ) : conversations.length === 0 ? (
              <div className="messages-empty-side">
                <p>No conversations yet</p>
                <span>
                  {role === "job_seeker"
                    ? "Upgrade to Premium and message recruiters from Applied Jobs."
                    : "Message applicants from the View Applicants page."}
                </span>
              </div>
            ) : (
              <ul className="conversation-list">
                {conversations.map((c) => {
                  const other = otherParty(c);
                  const active = c.id === selectedId;
                  const unread = c.unreadCount || 0;

                  return (
                    <li
                      key={c.id}
                      className={`conversation-item ${active ? "active" : ""} ${
                        unread > 0 ? "has-unread" : ""
                      }`}
                      onClick={() => selectConversation(c.id)}
                    >
                      <div className="conversation-avatar">
                        {(other?.name || "?").charAt(0).toUpperCase()}
                      </div>

                      <div className="conversation-info">
                        <div className="conversation-name-row">
                          <span className="conversation-name">
                            {other?.name || "User"}
                          </span>
                          {unread > 0 && (
                            <span className="conversation-unread-badge">
                              {unread > 99 ? "99+" : unread}
                            </span>
                          )}
                        </div>
                        <div className="conversation-meta">
                          {other?.email ||
                            (c.initiatedBy
                              ? `Started by ${String(c.initiatedBy).toLowerCase()}`
                              : "Conversation")}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </aside>

          {/* Chat panel */}
          <section className="messages-chat">
            {!selectedId ? (
              <div className="messages-placeholder">
                <div className="messages-placeholder-icon">💬</div>
                <h3>Select a conversation</h3>
                <p>Choose a chat from the left to view and send messages.</p>
              </div>
            ) : (
              <>
                <div className="messages-chat-header">
                  <div className="conversation-avatar large">
                    {(peer?.name || "?").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3>{peer?.name || "Conversation"}</h3>
                    <p className="messages-peer-email">
                      {peer?.email || ""}
                      {peer?.role
                        ? ` · ${String(peer.role).replace("_", " ")}`
                        : ""}
                    </p>
                  </div>
                </div>

                <div className="messages-thread">
                  {loadingChat ? (
                    <div className="messages-thread-loading">
                      Loading messages...
                    </div>
                  ) : error ? (
                    <div className="messages-thread-error">{error}</div>
                  ) : messages.length === 0 ? (
                    <div className="messages-thread-empty">
                      No messages yet. Say hello!
                    </div>
                  ) : (
                    messages.map((m) => {
                      const isMine =
                        m.sender?.id === currentUserId ||
                        m.senderId === currentUserId;
                      return (
                        <div
                          key={m.id}
                          className={`message-bubble ${
                            isMine ? "mine" : "theirs"
                          }`}
                        >
                          <div className="message-content">{m.content}</div>
                          <div className="message-time">
                            {m.sentAt
                              ? new Date(m.sentAt).toLocaleString([], {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : ""}
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form className="messages-composer" onSubmit={sendMessage}>
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    maxLength={2000}
                  />
                  <button
                    type="submit"
                    className="btn-send"
                    disabled={sending || !content.trim()}
                  >
                    {sending ? "..." : "Send"}
                  </button>
                </form>
              </>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default Messages;