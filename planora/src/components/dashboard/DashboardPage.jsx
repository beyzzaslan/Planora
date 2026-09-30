function DashboardPage({
  todos,
  notes,
  mediaList,
  reminders,
  pinnedNotes,
}) {
  return (
    <>
      <section className="stats-grid">
        <div className="stat-card">
          <span>Total Tasks</span>
          <strong>{todos.length}</strong>
        </div>

        <div className="stat-card">
          <span>Notes</span>
          <strong>{notes.length}</strong>
        </div>

        <div className="stat-card">
          <span>Media</span>
          <strong>{mediaList.length}</strong>
        </div>

        <div className="stat-card">
          <span>Reminders</span>
          <strong>{reminders.length}</strong>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="panel full-width-panel">
          <h3>Upcoming Reminders</h3>

          {reminders.length > 0 ? (
            reminders.slice(0, 4).map((reminder) => (
              <div className="mini-reminder" key={reminder.id}>
                <div>
                  <strong>{reminder.content}</strong>
                  <small>
                    {reminder.taskDate} · {reminder.taskTime}
                  </small>
                </div>
                <span>{reminder.reminderOffset} min</span>
              </div>
            ))
          ) : (
            <p className="empty-text">No reminders yet.</p>
          )}
        </div>

        <div className="panel">
          <div className="panel-heading">
            <h3>Pinned Notes</h3>
            <span className="panel-count">{pinnedNotes.length}</span>
          </div>

          {pinnedNotes.length > 0 ? (
            <div className="pinned-note-list">
              {pinnedNotes.map((pinnedNote) => (
                <div
                  key={pinnedNote.id}
                  className="pinned-note-item"
                  style={{
                    borderLeftColor: pinnedNote.color || "#F9A8D4",
                  }}
                >
                  <strong>{pinnedNote.title || "Başlıksız not"}</strong>
                  <p>{pinnedNote.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-text">No pinned notes yet.</p>
          )}
        </div>
      </section>
    </>
  );
}

export default DashboardPage;
