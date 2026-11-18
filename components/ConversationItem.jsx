import { Star } from "lucide-react";

function ConversationItem({
  conversation,
  selected,
  onClick,
  onToggleStar,
}) {
  const channelDisplay =
    conversation.channel === "whatsapp"
      ? "WhatsApp"
      : "Instagram";

  const handleStarClick = (e) => {
    e.stopPropagation();
    onToggleStar(conversation.id);
  };

  return (
    <div
      className={`conversation-item ${selected ? "selected" : ""}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick();
        }
      }}
    >
      {/* AVATAR */}
      <div className="conversation-avatar">
        {conversation.name.charAt(0)}
        {conversation.online && <span className="online-dot"></span>}
      </div>

      {/* CONTENT */}
      <div className="conversation-content">
        {/* NAME & TIME & LABEL */}
        <div className="conversation-top">
          <div className="conversation-top-left">
            <strong>{conversation.name}</strong>
            {conversation.label && (
              <span className="label-badge">{conversation.label}</span>
            )}
          </div>
          <span>{conversation.time}</span>
        </div>

        {/* MESSAGE & UNREAD */}
        <div className="conversation-bottom">
          <p>{conversation.message}</p>
          {conversation.unread > 0 && (
            <span className="unread-badge">
              {conversation.unread}
            </span>
          )}
        </div>

        {/* CHANNEL */}
        <span className={`channel-label ${conversation.channel}`}>
          {channelDisplay}
        </span>
      </div>

      {/* STAR BUTTON */}
      <button
        className={`star-button ${conversation.starred ? "active" : ""}`}
        onClick={handleStarClick}
        title={conversation.starred ? "Remove from starred" : "Add to starred"}
        aria-label={conversation.starred ? "Remove from starred" : "Add to starred"}
      >
        <Star size={16} fill={conversation.starred ? "currentColor" : "none"} />
      </button>
    </div>
  );
}

export default ConversationItem;
