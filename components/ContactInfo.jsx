import { useState } from "react";

function ContactInfo({
  conversation,
  onClose,
  onUpdateLabel,
}) {
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [labelValue, setLabelValue] = useState(conversation.label);

  const channelName =
    conversation.channel === "whatsapp"
      ? "WhatsApp"
      : "Instagram";

  const handleSaveLabel = () => {
    onUpdateLabel(conversation.id, labelValue);
    setIsEditingLabel(false);
  };

  const handleCancelLabel = () => {
    setLabelValue(conversation.label);
    setIsEditingLabel(false);
  };

  return (
    <aside className="contact-panel">
      {/* HEADER */}
      <div className="contact-header">
        <h3>Detail Kontak</h3>
        <button
          onClick={onClose}
          className="contact-close"
          aria-label="Tutup panel kontak"
        >
          ×
        </button>
      </div>

      {/* PROFILE */}
      <div className="contact-profile">
        <div className="contact-avatar">
          {conversation.name.charAt(0)}
        </div>
        <h2>{conversation.name}</h2>
        <span className="contact-channel">
          {channelName}
        </span>
      </div>

      {/* DETAILS */}
      <div className="contact-details">
        {/* NAMA */}
        <div className="detail-item">
          <span>Nama</span>
          <strong>{conversation.name}</strong>
        </div>

{/* LABEL */}
<div className="detail-item label-detail">
  <span>Label</span>

  {!isEditingLabel ? (
    <div className="label-view">
      {conversation.label ? (
        <div className="label-tag">
          {conversation.label}
        </div>
      ) : (
        <div className="label-empty">
          Belum ada
        </div>
      )}

      <button
        className="edit-label-btn"
        onClick={() => setIsEditingLabel(true)}
        title="Edit label"
      >
        ✎
      </button>
    </div>
  ) : (
    <div className="label-edit-box">

      <input
        type="text"
        value={labelValue}
        onChange={(e) => setLabelValue(e.target.value)}
        placeholder="Nama label"
        autoFocus
        className="label-input"
      />

      <div className="label-actions">
        <button
          className="save-btn"
          onClick={handleSaveLabel}
        >
          ✓
        </button>

        <button
          className="cancel-btn"
          onClick={handleCancelLabel}
        >
          ×
        </button>
      </div>

    </div>
  )}
</div>


      </div>


    </aside>
  );
}

export default ContactInfo;
