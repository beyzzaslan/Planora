import NoteItem from "./NoteItem";

function NoteList({ notes, onDeleteNote, onUpdateNote, onTogglePin }) {
  const sortedNotes = [...notes].sort((a, b) => {
    if (a.pinned === b.pinned) return 0;
    return a.pinned ? -1 : 1;
  });

  return (
    <div className="note-list">
      {sortedNotes.map((note) => (
        <NoteItem
          key={note.id}
          note={note}
          onDeleteNote={onDeleteNote}
          onUpdateNote={onUpdateNote}
          onTogglePin={onTogglePin}
        />
      ))}
    </div>
  );
}
export default NoteList;
