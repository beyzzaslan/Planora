import { useState } from "react";

function NoteItem({ note, onDeleteNote, onUpdateNote, onTogglePin }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [color, setColor] = useState(note.color || "#F9A8D4");

  const handleSave = async () => {
    const payload = {
      title: title.trim(),
      content: content.trim(),
      color,
      pinned: note.pinned,
    };

    const updated = await onUpdateNote(note.id, payload);

    if (updated) {
      setIsEditing(false);
    }
  };

  return (
    <div
      className={`note-card ${note.pinned ? "pinned" : ""}`}
      style={{ backgroundColor: color }}
    >
      <div className="note-header">
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="note-input"
          />
        ) : (
          <h3>{note.title || "Başlıksız not"}</h3>
        )}

        <button className="ghost-button" onClick={() => onTogglePin(note.id)}>
          {note.pinned ? "Unpin" : "Pin"}
        </button>
      </div>

      {isEditing ? (
        <>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="note-textarea"
          />

          <div className="note-edit-row">
            <label>
              Renk
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </label>
          </div>

          <div className="note-actions">
            <button className="primary-button" onClick={handleSave}>
              Kaydet
            </button>
            <button
              className="ghost-button"
              onClick={() => setIsEditing(false)}
            >
              Vazgeç
            </button>
          </div>
        </>
      ) : (
        <>
          <p>{note.content}</p>

          <div className="note-actions">
            <button className="ghost-button" onClick={() => setIsEditing(true)}>
              Düzenle
            </button>
            <button
              className="ghost-button"
              onClick={() => onDeleteNote(note.id)}
            >
              Sil
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default NoteItem;
