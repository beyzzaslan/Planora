import { useState } from "react";
import {
  FiEdit2,
  FiExternalLink,
  FiFileText,
  FiTrash2,
  FiVideo,
} from "react-icons/fi";

function MediaList({ mediaList, onDeleteMedia, onUpdateMedia }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    fileUrl: "",
    mediaType: "image/png",
  });

  const [activeFilter, setActiveFilter] = useState("ALL");

  const filters = [
    { id: "ALL", label: "Tümü" },
    { id: "IMAGE", label: "Görseller" },
    { id: "VIDEO", label: "Videolar" },
    { id: "PDF", label: "PDF'ler" },
    { id: "LINK", label: "Linkler" },
  ];

  const filteredMedia = mediaList.filter((media) => {
    if (activeFilter === "ALL") return true;
    if (activeFilter === "IMAGE") return media.mediaType.startsWith("image/");
    if (activeFilter === "VIDEO") return media.mediaType.startsWith("video/");
    if (activeFilter === "PDF") return media.mediaType === "application/pdf";

    return media.mediaType === "text/html";
  });

  const getMediaPreview = (media) => {
    if (media.mediaType.startsWith("image/")) {
      return (
        <img
          className="media-image-preview"
          src={media.fileUrl}
          alt={media.title}
        />
      );
    }

    if (media.mediaType.startsWith("video/")) {
      return (
        <div className="media-type-preview video-preview">
          <FiVideo />
          <span>Video</span>
        </div>
      );
    }

    if (media.mediaType === "application/pdf") {
      return (
        <div className="media-type-preview pdf-preview">
          <FiFileText />
          <span>PDF / Doküman</span>
        </div>
      );
    }

    return (
      <div className="media-type-preview link-preview">
        <FiExternalLink />
        <span>Web bağlantısı</span>
      </div>
    );
  };

  const startEditing = (media) => {
    setEditingId(media.id);

    setEditForm({
      title: media.title,
      fileUrl: media.fileUrl,
      mediaType: media.mediaType,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const handleUpdate = async (event, media) => {
    event.preventDefault();

    const updated = await onUpdateMedia(media.id, {
      title: editForm.title.trim(),
      fileName: editForm.title.trim(),
      fileUrl: editForm.fileUrl.trim(),
      mediaType: editForm.mediaType,
    });

    if (updated) {
      setEditingId(null);
    }
  };

  return (
    <div className="media-library">
      <div className="media-filter-bar">
        {filters.map((filter) => (
          <button
            type="button"
            key={filter.id}
            className={
              activeFilter === filter.id
                ? "media-filter-button active"
                : "media-filter-button"
            }
            onClick={() => setActiveFilter(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="media-list">
        {filteredMedia.map((media) => (
        <article className="media-card" key={media.id}>
          {editingId === media.id ? (
            <form
              className="media-edit-form"
              onSubmit={(event) => handleUpdate(event, media)}
            >
              <label>
                Başlık
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(event) =>
                    setEditForm({
                      ...editForm,
                      title: event.target.value,
                    })
                  }
                  required
                />
              </label>

              <label>
                Bağlantı
                <input
                  type="url"
                  value={editForm.fileUrl}
                  onChange={(event) =>
                    setEditForm({
                      ...editForm,
                      fileUrl: event.target.value,
                    })
                  }
                  required
                />
              </label>

              <label>
                Kaynak türü
                <select
                  value={editForm.mediaType}
                  onChange={(event) =>
                    setEditForm({
                      ...editForm,
                      mediaType: event.target.value,
                    })
                  }
                >
                  <option value="image/png">Görsel</option>
                  <option value="video/mp4">Video</option>
                  <option value="application/pdf">PDF / Doküman</option>
                  <option value="text/html">Web bağlantısı</option>
                </select>
              </label>

              <div className="media-edit-actions">
                <button type="button" onClick={cancelEditing}>
                  Vazgeç
                </button>

                <button type="submit">Kaydet</button>
              </div>
            </form>
          ) : (
            <>
              {getMediaPreview(media)}

              <div className="media-card-content">
                <div>
                  <span className="media-type-label">
                    {media.mediaType.startsWith("image/")
                      ? "Görsel"
                      : media.mediaType.startsWith("video/")
                        ? "Video"
                        : media.mediaType === "application/pdf"
                          ? "PDF / Doküman"
                          : "Web bağlantısı"}
                  </span>

                  <h4>{media.title}</h4>
                </div>

                <div className="media-card-actions">
                  <button
                    type="button"
                    className="media-edit-button"
                    onClick={() => startEditing(media)}
                    aria-label={`${media.title} kaynağını düzenle`}
                    title="Kaynağı düzenle"
                  >
                    <FiEdit2 />
                  </button>

                  <button
                    type="button"
                    className="media-delete-button"
                    onClick={() => onDeleteMedia(media.id)}
                    aria-label={`${media.title} kaynağını sil`}
                    title="Kaynağı sil"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>

              <a
                className="media-open-link"
                href={media.fileUrl}
                target="_blank"
                rel="noreferrer"
              >
                Kaynağı aç
                <FiExternalLink />
              </a>
            </>
          )}
        </article>
        ))}
      </div>
    </div>
  );
}

export default MediaList;
