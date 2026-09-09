import { useEffect, useRef, useState } from "react";
function MediaCreate({ onCreateMedia, onUploadMedia }) {
  const [title, setTitle] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [mediaType, setMediaType] = useState("image/png");
  const [inputMode, setInputMode] = useState("URL");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  useEffect(() => {
    if (feedback?.type !== "success") return;

    const timeoutId = setTimeout(() => {
      setFeedback(null);
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [feedback]);
  const fileInputRef = useRef(null);

  const clearForm = () => {
    setTitle("");
    setFileUrl("");
    setMediaType("image/png");
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const maximumFileSize = 50 * 1024 * 1024;

    if (file.size > maximumFileSize) {
      setSelectedFile(null);
      setFeedback({
        type: "error",
        message: "Dosya en fazla 50 MB olabilir.",
      });
      event.target.value = "";
      return;
    }
    setFeedback(null);

    setSelectedFile(file);

    if (!title.trim()) {
      const titleFromFileName = file.name.replace(/\.[^/.]+$/, "");
      setTitle(titleFromFileName);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      setFeedback({
        type: "error",
        message: "Lütfen bir başlık gir.",
      });
      return;
    }

    if (inputMode === "FILE" && !selectedFile) {
      setFeedback({
        type: "error",
        message: "Lütfen yüklenecek dosyayı seç.",
      });
      return;
    }

    if (inputMode === "URL" && !fileUrl.trim()) {
      setFeedback({
        type: "error",
        message: "Lütfen bir bağlantı gir.",
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      let created = false;

      if (inputMode === "FILE") {
        created = await onUploadMedia(title.trim(), selectedFile);
      } else {
        const payload = {
          title: title.trim(),
          fileName: title.trim(),
          fileUrl: fileUrl.trim(),
          mediaType,
        };

        created = await onCreateMedia(payload);
      }

      if (created) {
        clearForm();

        setFeedback({
          type: "success",
          message:
            inputMode === "FILE"
              ? "Dosya başarıyla yüklendi."
              : "Bağlantı başarıyla eklendi.",
        });
      } else {
        setFeedback({
          type: "error",
          message: "İşlem gerçekleştirilemedi. Lütfen tekrar dene.",
        });
      }
    } catch (error) {
      console.error("Kaynak eklenemedi:", error);

      setFeedback({
        type: "error",
        message: "Beklenmeyen bir hata oluştu.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="media-create" onSubmit={handleSubmit}>
      <h3>Kaynak Ekle</h3>

      <div className="media-mode-buttons">
        <button
          type="button"
          className={inputMode === "URL" ? "active" : ""}
          onClick={() => {
            setInputMode("URL");
            setFeedback(null);
          }}
        >
          Bağlantı ekle
        </button>

        <button
          type="button"
          className={inputMode === "FILE" ? "active" : ""}
          onClick={() => {
            setInputMode("FILE");
            setFeedback(null);
          }}
        >
          Dosya yükle
        </button>
      </div>

      <label className="media-field">
        <span>Başlık</span>

        <input
          type="text"
          placeholder="Kaynak başlığı"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
      </label>

      {inputMode === "URL" ? (
        <>
          <label className="media-field">
            <span>Bağlantı</span>

            <input
              type="url"
              placeholder="https://..."
              value={fileUrl}
              onChange={(event) => setFileUrl(event.target.value)}
              required
            />
          </label>

          <label className="media-field">
            <span>Kaynak türü</span>

            <select
              value={mediaType}
              onChange={(event) => setMediaType(event.target.value)}
            >
              <option value="image/png">Görsel</option>
              <option value="video/mp4">Video</option>
              <option value="application/pdf">PDF / Doküman</option>
              <option value="text/html">Web bağlantısı</option>
            </select>
          </label>
        </>
      ) : (
        <label className="media-field">
          <span>Dosya seç</span>

          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.mp4,.pdf"
            onChange={handleFileChange}
            required
          />
        </label>
      )}

      {feedback && (
        <p className={`media-feedback ${feedback.type}`}>{feedback.message}</p>
      )}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? "İşlem yapılıyor..."
          : inputMode === "FILE"
            ? "Dosyayı yükle"
            : "Bağlantıyı ekle"}
      </button>
    </form>
  );
}

export default MediaCreate;
