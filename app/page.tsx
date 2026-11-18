"use client";

import { useState } from "react";
import ConversationList from "@/components/ConversationList";
import ChatWindow from "@/components/ChatWindow";
import ContactInfo from "@/components/ContactInfo";
import { conversations as initialConversations } from "@/data/conversations";

export default function Home() {
  // =========================
  // CONVERSATIONS
  // =========================
  const [conversations, setConversations] = useState(initialConversations);

  // =========================
  // SELECTED CONVERSATION
  // =========================
  const [selectedConversation, setSelectedConversation] = useState<any>(null);

  // =========================
  // CONTACT INFO
  // =========================
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [listOpen, setListOpen] = useState(false);

  // =========================
  // TOGGLE STARRED
  // =========================
  const toggleStarred = (conversationId: any) => {
    setConversations((prev: any[]) =>
      prev.map((conversation) =>
        conversation.id === conversationId
          ? { ...conversation, starred: !conversation.starred }
          : conversation
      )
    );

    if (selectedConversation?.id === conversationId) {
      setSelectedConversation((prev: any) => ({
        ...prev,
        starred: !prev?.starred,
      }));
    }
  };

  // =========================
  // UPDATE LABEL
  // =========================
  const updateLabel = (conversationId: any, label: string) => {
    setConversations((prev: any[]) =>
      prev.map((conversation) =>
        conversation.id === conversationId
          ? { ...conversation, label }
          : conversation
      )
    );

    if (selectedConversation?.id === conversationId) {
      setSelectedConversation((prev: any) => ({
        ...prev,
        label,
      }));
    }
  };

  const handleSelectConversation = (conversation: any) => {
    setConversations((previousConversations: any[]) =>
      previousConversations.map((item) =>
        item.id === conversation.id ? { ...item, unread: 0 } : item
      )
    );
    setSelectedConversation({ ...conversation, unread: 0 });
    setListOpen(false);
  };

  return (
    <div className="app">
      <button
        type="button"
        className="mobile-inbox-toggle"
        onClick={() => setListOpen((previous) => !previous)}
        aria-expanded={listOpen}
        aria-controls="conversation-list-panel"
        aria-label={listOpen ? "Tutup daftar percakapan" : "Buka daftar percakapan"}
      >
        <span aria-hidden="true">{listOpen ? "‹" : "☰"}</span>
      </button>
      {listOpen && (
        <button
          type="button"
          className="mobile-inbox-backdrop"
          onClick={() => setListOpen(false)}
          aria-label="Tutup daftar percakapan"
        />
      )}
      <ConversationList
        id="conversation-list-panel"
        isOpen={listOpen}
        conversations={conversations}
        selectedConversation={selectedConversation}
        onSelectConversation={handleSelectConversation}
        onToggleStar={toggleStarred}
      />

      {/* CHAT */}
      <ChatWindow
        conversation={selectedConversation}
        onOpenContact={() => setShowContactInfo(true)}
        onToggleStar={toggleStarred}
      />

      {/* CONTACT INFO */}
      {showContactInfo && selectedConversation && (
        <ContactInfo
          conversation={selectedConversation}
          onClose={() => setShowContactInfo(false)}
          onUpdateLabel={updateLabel}
        />
      )}
    </div>
  );
}
