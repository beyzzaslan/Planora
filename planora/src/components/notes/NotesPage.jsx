import NoteCreate from "../NoteCreate";
import NoteList from "../NoteList";

function NotesPage({
  notes,
  onCreateNote,
  onDeleteNote,
  onUpdateNote,
  onTogglePin,
}) {
  return (
    <div className="content-section">
      <div className="notes-section">
        <div className="note-create-column">
          <NoteCreate onCreateNote={onCreateNote} />
        </div>

        <div className="note-list-column">
          <NoteList
            notes={notes}
            onDeleteNote={onDeleteNote}
            onUpdateNote={onUpdateNote}
            onTogglePin={onTogglePin}
          />
        </div>
      </div>
    </div>
  );
}

export default NotesPage;
