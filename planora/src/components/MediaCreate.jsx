import { useState } from "react";

function MediaCreate({ onCreateMedia }) {
  const [title, setTitle] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [mediaType, setMediaType] = useState("image/png");

  const handleSubmit = async () => {
    if (!title.trim() || !fileUrl.trim()) return;

    const payload = {
      title: title.trim(),
      fileName: title.trim(),
      fileUrl: fileUrl.trim(),
      mediaType,
    };

    const created = await onCreateMedia(payload);
    if (created) {
      setTitle("");
      setFileUrl("");
      setMediaType("image/png");
    }
  };

  return (
    <div className="media-create">
      <h3>Kaynak Ekle</h3>

      <input
        type="text"
        placeholder="Başlık"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="text"
        placeholder="Görsel, video, PDF veya web bağlantısı"
        value={fileUrl}
        onChange={(e) => setFileUrl(e.target.value)}
      />

      <label className="media-field">
        <span>Kaynak Türü</span>

        <select
          value={mediaType}
          onChange={(e) => setMediaType(e.target.value)}
        >
          <option value="image/png">Görsel</option>
          <option value="video/mp4">Video</option>
          <option value="application/pdf">PDF / Doküman</option>
          <option value="text/html">Web bağlantısı</option>
        </select>
      </label>

      <button onClick={handleSubmit}>Ekle</button>
    </div>
  );
}
export default MediaCreate;
