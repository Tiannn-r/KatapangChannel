import { Star } from "lucide-react";

function ChatHeader({ conversation, onOpenContact, onToggleStar }) {
  const handleProfileKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpenContact?.();
    }
  };

  return (
    <header className="chat-header">
      <div
        className="chat-user"
        onClick={onOpenContact}
        onKeyDown={handleProfileKeyDown}
        role="button"
        tabIndex={0}
        aria-label="Info Kontak"
      >
        <div className="chat-avatar">
          {conversation.name.charAt(0)}
          {conversation.online && <span className="chat-online-dot"></span>}
        </div>

        <div className="chat-user-info">
          <h3>{conversation.name}</h3>
          <span>
            <i></i>
            {conversation.online ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      <div className="chat-actions">
        <button
          title={conversation.starred ? "Remove from starred" : "Add to starred"}
          aria-label={conversation.starred ? "Remove from starred" : "Add to starred"}
          onClick={onToggleStar}
          className={conversation.starred ? "active" : ""}
        >
          <Star
            size={18}
            fill={conversation.starred ? "currentColor" : "none"}
          />
        </button>
      </div>
    </header>
  );
}

export default ChatHeader;
