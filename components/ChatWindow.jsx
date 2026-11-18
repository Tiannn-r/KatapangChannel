import { useState } from "react";
import { MessageCircle } from "lucide-react";

import { messages as initialMessages } from "../data/Massages";

import ChatHeader from "./ChatHeader";
import MessageBubble from "./MassageBubble";
import MessageInput from "./MassagesInput";

function ChatWindow({ conversation, onOpenContact, onToggleStar }) {
  const [messages, setMessages] = useState(initialMessages);

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

  const conversationMessages = messages.filter(
    (message) => message.conversationId === conversation.id
  );

  const handleSendMessage = (text) => {
    const newMessage = {
      id: Date.now(),
      conversationId: conversation.id,
      sender: "agent",
      text,
      time: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((previousMessages) => [...previousMessages, newMessage]);
  };

  return (
    <main className="chat-window">
      {/* HEADER */}
      <ChatHeader
        conversation={conversation}
        onOpenContact={onOpenContact}
        onToggleStar={() => onToggleStar(conversation.id)}
      />

      {/* MESSAGES */}
      <div className="messages-container">
        <div className="date-divider">
          <span>Hari ini</span>
        </div>

        {conversationMessages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>

      {/* INPUT */}
      <MessageInput onSendMessage={handleSendMessage} />
    </main>
  );
}

export default ChatWindow;
