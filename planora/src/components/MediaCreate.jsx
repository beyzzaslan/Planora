import { useState } from "react";

function MediaCreate({ onCreateMedia }) {
  const [title, setTitle] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [mediaType, setMediaType] = useState("image/png");

  const handleSubmit = async () => {
    if (!title.trim() || !fileUrl.trim()) return;

    const payload = {
      title: title.trim(),
      fileName: fileName.trim() || "media-file",
      fileUrl: fileUrl.trim(),
      mediaType,
    };

    const created = await onCreateMedia(payload);
    if (created) {
      setTitle("");
      setFileName("");
      setFileUrl("");
      setMediaType("image/png");
    }
  };

  return (
    <div className="media-create">
      <h3>Medya Ekle</h3>

      <input
        type="text"
        placeholder="Başlık"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="text"
        placeholder="Dosya adı"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Dosya URL"
        value={fileUrl}
        onChange={(e) => setFileUrl(e.target.value)}
      />

      <select value={mediaType} onChange={(e) => setMediaType(e.target.value)}>
        <option value="image/png">image/png</option>
        <option value="image/jpeg">image/jpeg</option>
        <option value="video/mp4">video/mp4</option>
        <option value="application/pdf">application/pdf</option>
      </select>

      <button onClick={handleSubmit}>Ekle</button>
    </div>
  );
}
export default MediaCreate;
