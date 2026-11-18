import { useState } from "react";
import { Send } from "lucide-react";

function MessageInput({ onSendMessage }) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) {
      return;
    }

    onSendMessage(message.trim());
    setMessage("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      handleSend();
    }
  };


  return (
    <div className="message-input-container">

      {/* INPUT */}
      <textarea
        value={message}
        placeholder="Ketik pesan..."
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
      />

      {/* SEND */}
      <button className="send-button" onClick={handleSend} aria-label="Kirim pesan">
        <Send size={17} />
      </button>
    </div>
  );
}

export default MessageInput;
