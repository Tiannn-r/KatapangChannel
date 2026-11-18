import { useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";

import ChatHeader from "./ChatHeader";
import MessageBubble from "./MassageBubble";
import MessageInput from "./MassagesInput";

/**
 * @param {{
 *   conversation: any,
 *   messages?: any[],
 *   onSendMessage: (text: string) => void,
 *   onOpenContact?: () => void,
 *   onToggleStar?: any,
 *   isLoading?: boolean
 * }} props
 */
function ChatWindow({
  conversation,
  messages,
  onSendMessage,
  onOpenContact,
  onToggleStar,
  isLoading = false,
}) {
  const messageList = messages || [];
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

  if (!conversation) {
    return (
      <main className="chat-window chat-window-empty">
        <div className="empty-chat">
          <div className="empty-chat-icon">
            <MessageCircle size={40} />
          </div>
          <h2>Pilih percakapan</h2>
          <p>Pilih salah satu percakapan dari daftar untuk melihat pesan</p>
        </div>
      </main>
    );
  }

  return (
    <main className="chat-window">
      {/* HEADER */}
      <ChatHeader
        conversation={conversation}
        onOpenContact={onOpenContact}
        onToggleStar={() => onToggleStar?.(conversation.id)}
      />

      {/* MESSAGES */}
      <div className="messages-container">
        <div className="date-divider">
          <span>Riwayat Pesan</span>
        </div>

        {isLoading ? (
          <div style={{ textAlign: "center", padding: "30px", color: "var(--muted)" }}>
            Memuat pesan...
          </div>
        ) : messageList.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--muted)" }}>
            <p>Belum ada pesan dalam percakapan ini.</p>
            <p style={{ fontSize: "12px", marginTop: "4px" }}>
              Ketik balasan di bawah untuk mengirim pesan.
            </p>
          </div>
        ) : (
          messageList.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <MessageInput onSendMessage={onSendMessage} />
    </main>
  );
}

export default ChatWindow;
