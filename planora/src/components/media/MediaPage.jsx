import MediaCreate from "../MediaCreate";
import MediaList from "../MediaList";

function MediaPage({
  mediaList,
  onCreateMedia,
  onUploadMedia,
  onDeleteMedia,
  onUpdateMedia,
}) {
  return (
    <div className="content-section">
      <div className="media-section">
        <MediaCreate
          onCreateMedia={onCreateMedia}
          onUploadMedia={onUploadMedia}
        />

        <MediaList
          mediaList={mediaList}
          onDeleteMedia={onDeleteMedia}
          onUpdateMedia={onUpdateMedia}
        />
      </div>
    </div>
  );
}

export default MediaPage;
