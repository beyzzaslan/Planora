import { useState } from "react";

function NoteCreate({ onCreateNote }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("#F9A8D4");
  const [pinned, setPinned] = useState(false);

  const handleCreate = async () => {
    if (!title.trim() && !content.trim()) return;

    const payload = {
      title: title.trim(),
      content: content.trim(),
      color,
      pinned,
    };

    const created = await onCreateNote(payload);

    if (created) {
      setTitle("");
      setContent("");
      setColor("#F9A8D4");
      setPinned(false);
    }
  };
  return (
    <div className="note-create">
      <input
        type="text"
        placeholder="Not başlığı"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="note-input"
      />
      <textarea
        placeholder="Not yaz..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="note-textarea"
      />
      <div className="note-form-row">
        <label>
          Renk
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </label>

        <label className="pin-label">
          <input
            type="checkbox"
            checked={pinned}
            onChange={(e) => setPinned(e.target.checked)}
          />
          Sabit
        </label>
      </div>

      <button onClick={handleCreate} className="primary-button">
        Not ekle
      </button>
    </div>
  );
}
export default NoteCreate;
