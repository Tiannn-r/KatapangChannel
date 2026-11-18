"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import ConversationList from "@/components/ConversationList";
import ChatWindow from "@/components/ChatWindow";
import ContactInfo from "@/components/ContactInfo";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [currentMessages, setCurrentMessages] = useState<any[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [listOpen, setListOpen] = useState(false);

  // Ref to track current selected conversation inside realtime subscription without stale closure
  const selectedConvRef = useRef<any>(null);
  selectedConvRef.current = selectedConversation;

  // =========================
  // FETCH CONVERSATIONS FROM SUPABASE
  // =========================
  const loadConversations = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("conversations")
        .select(`
          id,
          status,
          created_at,
          contact_id,
          contacts (
            id,
            nama,
            channel,
            identifier,
            label
          ),
          messages (
            id,
            content,
            created_at,
            sender_type
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Gagal mengambil percakapan:", error);
        return;
      }

      if (data) {
        const mapped = data.map((item: any) => {
          const sortedMsgs = (item.messages || []).sort(
            (a: any, b: any) =>
              new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
          const lastMsg = sortedMsgs[sortedMsgs.length - 1];
          const timeStr = lastMsg
            ? new Date(lastMsg.created_at).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : new Date(item.created_at).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "2-digit",
              });

          return {
            id: item.id,
            contact_id: item.contacts?.id,
            name: item.contacts?.nama || item.contacts?.identifier || "Tanpa Nama",
            channel: item.contacts?.channel || "whatsapp",
            identifier: item.contacts?.identifier || "",
            label: item.contacts?.label || "",
            message: lastMsg?.content || "(Belum ada pesan)",
            time: timeStr,
            unread: 0,
            starred: false,
            online: true,
          };
        });

        setConversations(mapped);

        // If no conversation is selected yet and we have data, select the first one by default
        if (!selectedConvRef.current && mapped.length > 0) {
          handleSelectConversation(mapped[0]);
        }
      }
    } catch (err) {
      console.error("Error loadConversations:", err);
    }
  }, []);

  // =========================
  // FETCH MESSAGES FOR A CONVERSATION
  // =========================
  const loadMessages = useCallback(async (conversationId: string) => {
    setIsLoadingMessages(true);
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Gagal memuat pesan:", error);
        return;
      }

      if (data) {
        const formatted = data.map((m: any) => ({
          id: m.id,
          conversationId: m.conversation_id,
          sender: m.sender_type, // 'agent' atau 'contact'
          text: m.content,
          time: new Date(m.created_at).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));
        setCurrentMessages(formatted);
      }
    } catch (err) {
      console.error("Error loadMessages:", err);
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  // =========================
  // REALTIME SUBSCRIPTION
  // =========================
  useEffect(() => {
    loadConversations();

    // Subscribe to new messages in Supabase Realtime
    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload: any) => {
          const newMsg = payload.new;

          // If incoming message belongs to currently open conversation, append immediately
          if (selectedConvRef.current?.id === newMsg.conversation_id) {
            setCurrentMessages((prev) => {
              // Avoid duplicate if optimistic message was added
              if (prev.some((m) => m.id === newMsg.id)) return prev;
              return [
                ...prev,
                {
                  id: newMsg.id,
                  conversationId: newMsg.conversation_id,
                  sender: newMsg.sender_type,
                  text: newMsg.content,
                  time: new Date(newMsg.created_at).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                },
              ];
            });
          }

          // Update conversation list preview
          loadConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadConversations]);

  // =========================
  // SELECT CONVERSATION
  // =========================
  const handleSelectConversation = (conversation: any) => {
    setSelectedConversation(conversation);
    setListOpen(false);
    loadMessages(conversation.id);
  };

  // =========================
  // SEND MESSAGE (AGENT -> SUPABASE & META)
  // =========================
  const handleSendMessage = async (text: string) => {
    if (!selectedConversation) return;

    const timeStr = new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // 1. Optimistic local update
    const optimisticId = "temp-" + Date.now();
    const optimisticMsg = {
      id: optimisticId,
      conversationId: selectedConversation.id,
      sender: "agent",
      text,
      time: timeStr,
    };
    setCurrentMessages((prev) => [...prev, optimisticMsg]);

    // Update conversation list preview
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedConversation.id
          ? { ...c, message: text, time: timeStr }
          : c
      )
    );

    try {
      // 2. Insert into Supabase messages table
      const { data: inserted, error: insertError } = await supabase
        .from("messages")
        .insert([
          {
            conversation_id: selectedConversation.id,
            sender_type: "agent",
            content: text,
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error("Gagal menyimpan pesan ke Supabase:", insertError);
      } else if (inserted) {
        // Replace temp optimistic id with real db id
        setCurrentMessages((prev) =>
          prev.map((m) => (m.id === optimisticId ? { ...m, id: inserted.id } : m))
        );
      }

      // 3. Dispatch to WhatsApp via Meta API if identifier exists
      if (selectedConversation.channel === "whatsapp" && selectedConversation.identifier) {
        fetch("/api/messages/reply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversation_id: selectedConversation.id,
            to: selectedConversation.identifier,
            content: text,
          }),
        }).catch((err) => {
          console.warn("Panggilan ke Meta Reply API:", err);
        });
      }
    } catch (err) {
      console.error("Error handleSendMessage:", err);
    }
  };

  // =========================
  // TOGGLE STARRED
  // =========================
  const toggleStarred = (conversationId: any) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId ? { ...c, starred: !c.starred } : c
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
  // UPDATE CONTACT LABEL
  // =========================
  const updateLabel = async (conversationId: any, label: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, label } : c))
    );

    if (selectedConversation?.id === conversationId) {
      setSelectedConversation((prev: any) => ({ ...prev, label }));
    }

    // Persist to Supabase contacts
    const target = conversations.find((c) => c.id === conversationId);
    if (target?.contact_id) {
      const { error } = await supabase
        .from("contacts")
        .update({ label })
        .eq("id", target.contact_id);

      if (error) {
        console.error("Gagal mengupdate label kontak:", error);
      }
    }
  };

  return (
    <div className="app">
      <button
        type="button"
        className="mobile-inbox-toggle"
        onClick={() => setListOpen((prev) => !prev)}
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

      {/* CONVERSATION LIST */}
      <ConversationList
        id="conversation-list-panel"
        isOpen={listOpen}
        conversations={conversations}
        selectedConversation={selectedConversation}
        onSelectConversation={handleSelectConversation}
        onToggleStar={toggleStarred}
      />

      {/* CHAT WINDOW */}
      <ChatWindow
        conversation={selectedConversation}
        messages={currentMessages}
        isLoading={isLoadingMessages}
        onSendMessage={handleSendMessage}
        onOpenContact={() => setShowContactInfo(true)}
        onToggleStar={toggleStarred}
      />

      {/* CONTACT INFO PANEL */}
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
