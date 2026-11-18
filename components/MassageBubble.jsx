function MessageBubble({ message }) {
  const isAgent = message.sender === "agent";

  return (
    <div className={`message-row ${isAgent ? "agent-message" : "customer-message"}`}>
      <div className="message-bubble">
        <p>{message.text}</p>
        <span className="message-time">
          {message.time}
          {isAgent && <span className="message-check">✓✓</span>}
        </span>
      </div>
    </div>
  );
}

export default MessageBubble;
