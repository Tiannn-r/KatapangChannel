import { useMemo, useState } from "react";
import ConversationItem from "./ConversationItem";
import { Star } from "lucide-react";

function ConversationList({
  id,
  isOpen,
  conversations,
  selectedConversation,
  onSelectConversation,
  onToggleStar,
}) {
  const [search, setSearch] = useState("");
  const [channelFilter, setChannelFilter] = useState("all");
  const [unreadFilter, setUnreadFilter] = useState("all");
  const [showStarredOnly, setShowStarredOnly] = useState(false);

  // =========================
  // FILTER CONVERSATIONS
  // =========================
  const filteredConversations = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return conversations.filter((conversation) => {
      const matchesSearch =
        searchText === "" ||
        conversation.name.toLowerCase().includes(searchText) ||
        conversation.message.toLowerCase().includes(searchText);

      const matchesChannel =
        channelFilter === "all" || conversation.channel === channelFilter;

      const matchesUnread =
        unreadFilter === "all" || conversation.unread > 0;

      const matchesStar =
        !showStarredOnly || conversation.starred;
      return matchesSearch && matchesChannel && matchesUnread && matchesStar;
    });
  }, [conversations, search, channelFilter, unreadFilter, showStarredOnly]);

  return (
    <section
      id={id}
      className={`conversation-list ${isOpen ? "is-open" : ""}`}
    >
      {/* HEADER */}
      <div className="conversation-list-header">
        <h2>Inbox</h2>
        <input
          type="text"
          placeholder="Cari percakapan..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {/* CHANNEL FILTER */}
      <div className="filter-group channel-filter-scroll">
        <button
          className={channelFilter === "all" ? "active" : ""}
          onClick={() => setChannelFilter("all")}
        >
          Semua
        </button>
        <button
          className={channelFilter === "whatsapp" ? "active" : ""}
          onClick={() => setChannelFilter("whatsapp")}
        >
          WhatsApp
        </button>
        <button
          className={channelFilter === "instagram" ? "active" : ""}
          onClick={() => setChannelFilter("instagram")}
        >
          Instagram
        </button>

        {/* STARRED FILTER */}
        <button
          className={`star-filter-btn ${showStarredOnly ? "active" : ""}`}
          onClick={() => setShowStarredOnly((prev) => !prev)}
          title="Tampilkan yang dibintangi saja"
          aria-pressed={showStarredOnly}
        >
          <Star size={16} fill={showStarredOnly ? "currentColor" : "none"} />
        </button>
      </div>

      {/* UNREAD FILTER */}
      <div className="filter-group filter-group-secondary">
        <button
          className={unreadFilter === "all" ? "active" : ""}
          onClick={() => setUnreadFilter("all")}
        >
          Semua
        </button>
        <button
          className={unreadFilter === "unread" ? "active" : ""}
          onClick={() => setUnreadFilter("unread")}
        >
          Belum dibaca
        </button>
      </div>

      {/* CONVERSATIONS */}
      <div className="conversation-items">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              selected={selectedConversation?.id === conversation.id}
              onClick={() => onSelectConversation(conversation)}
              onToggleStar={onToggleStar}
            />
          ))
        ) : (
          <div className="empty-conversations">
            <p>Tidak ada percakapan</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default ConversationList;
