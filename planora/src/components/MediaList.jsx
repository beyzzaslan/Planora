function MediaList({ mediaList, onDeleteMedia }) {
  return (
    <div className="media-list">
      {mediaList.map((media) => (
        <div className="media-card" key={media.id}>
          <h4>{media.title}</h4>

          {media.mediaType.startsWith("image/") ? (
            <img
              src={media.fileUrl}
              alt={media.title}
              style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }}
            />
          ) : (
            <p>Dosya Tipi : {media.mediaType}</p>
          )}

          <p>{media.fileName}</p>
          <p>{media.createdAt}</p>

          <button onClick={() => onDeleteMedia(media.id)}>Sil</button>
        </div>
      ))}
    </div>
  );
}
export default MediaList;
