import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./App.css";
import ToDoCreate from "./components/ToDoCreate";
import ToDoList from "./components/ToDoList";
import "./css/notes.css";
import NoteCreate from "./components/NoteCreate";
import NoteList from "./components/NoteList";

import MediaCreate from "./components/MediaCreate";
import MediaList from "./components/MediaList";
function App() {
  const [todos, setTodos] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [notes, setNotes] = useState([]);
  const notifiedReminderIds = useRef(new Set());
  const [mediaList, setMediaList] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const completedTodos = todos.filter(
    (todo) => todo.status === "COMPLETED",
  ).length;
  const pendingTodos = todos.length - completedTodos;
  const pinnedNotes = notes.filter((note) => note.pinned);
  const pageMeta = {
    dashboard: {
      label: "Your day at a glance",
      title: "Dashboard",
      icon: "📊",
    },
    tasks: { label: "Plan and organize", title: "Tasks", icon: "✅" },
    notes: { label: "Capture your ideas", title: "Notes", icon: "📝" },
    media: { label: "Keep your references", title: "Media", icon: "🗂️" },
    profile: { label: "Your personal space", title: "Profile", icon: "👤" },
  };
  const [profile, setProfile] = useState({
    name: "Beyza",
    email: "beyza@example.com",
    focus: "Daily",
  });

  const handleProfileChange = (field, value) => {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  };

  useEffect(() => {
    const getTasks = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/tasks");
        setTodos(response.data);
      } catch (error) {
        console.error("Tasklar getirilemedi : ", error);
      }
    };
    getTasks();
  }, []);

  useEffect(() => {
    const getReminders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/tasks/reminders",
        );
        setReminders(response.data); //Gelen veriler reminders state'ine kaydediliyor

        if ("Notification" in window && Notification.permission === "granted") {
          const now = new Date();

          response.data.forEach((reminder) => {
            const taskDateTime = new Date(
              `${reminder.taskDate}T${reminder.taskTime}`,
            );

            const reminderDateTime = new Date(
              taskDateTime.getTime() - reminder.reminderOffset * 60 * 1000,
            );

            const reminderIsDue = reminderDateTime <= now;
            const taskHasNotPassed = taskDateTime > now;
            const reminderKey = `${reminder.id}-${reminder.taskDate}-${reminder.taskTime}`;

            if (
              reminderIsDue &&
              taskHasNotPassed &&
              !notifiedReminderIds.current.has(reminderKey)
            ) {
              new Notification("Planora Hatırlatıcısı", {
                body: `${reminder.content} - ${reminder.reminderOffset} dakika kaldı`,
              });

              notifiedReminderIds.current.add(reminderKey);
            }
          });
        }
      } catch (error) {
        console.error("Hatırlatıcılar getirilemedi : ", error);
      }
    };
    getReminders();
    const reminderInterval = setInterval(getReminders, 60000); // 1 dakika aralıklarla hatırlatıcıları güncelle
    return () => {
      clearInterval(reminderInterval);
    };
  }, []);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const createTodo = async (newTodo) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/tasks",
        newTodo,
      );
      setTodos((currentTodos) => [...currentTodos, response.data]);
      return true;
    } catch (error) {
      console.error("Task oluşturulamadı", error);
      return false;
    }
  };

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/notes");
        setNotes(response.data);
      } catch (error) {
        console.error("Notlar getirilemedi: ", error);
      }
    };
    fetchNotes();
  }, []);

  const createNote = async (newNote) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/notes",
        newNote,
      );
      setNotes((current) => [response.data, ...current]);
      return true;
    } catch (error) {
      console.error("Not oluşturulamadı : ", error);
      return false;
    }
  };

  const updateNote = async (id, updatedNote) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/notes/${id}`,
        updatedNote,
      );

      setNotes((current) =>
        current.map((note) => (note.id === id ? response.data : note)),
      );

      return true;
    } catch (error) {
      console.error("Not güncellenemedi:", error);
      return false;
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/notes/${id}`);
      setNotes((current) => current.filter((note) => note.id !== id));
    } catch (error) {
      console.error("Not silinemedi", error);
    }
  };

  const togglePin = async (id) => {
    try {
      const response = await axios.patch(
        `http://localhost:8080/api/notes/${id}/pin`,
      );
      setNotes((current) =>
        current.map((note) => (note.id === id ? response.data : note)),
      );
    } catch (error) {
      console.error("Pin değiştirilemedi:", error);
    }
  };

  const removeTodo = async (todoId) => {
    try {
      await axios.delete(`http://localhost:8080/api/tasks/${todoId}`);
      setTodos((currentTodos) =>
        currentTodos.filter((todo) => todo.id !== todoId),
      );
    } catch (error) {
      console.error("Task silinemedi:", error);
    }
  };

  const updateTodo = async (id, updatedTodo) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/tasks/${id}`,
        updatedTodo,
      );
      setTodos((currentTodos) =>
        currentTodos.map((todo) => (todo.id == id ? response.data : todo)),
      );
      return true;
    } catch (error) {
      console.error("Task güncellenemedi:", error);

      return false;
    }
  };

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/media");
        setMediaList(response.data);
      } catch (error) {
        console.error("Media listesi getirilemedi:", error);
      }
    };
    fetchMedia();
  }, []);

  const createMedia = async (newMedia) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/media",
        newMedia,
      );
      setMediaList((current) => [response.data, ...current]);
      return true;
    } catch (error) {
      console.error("Medya oluşturulamadı:", error);
      return false;
    }
  };

  const deleteMedia = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/media/${id}`);
      setMediaList((current) => current.filter((media) => media.id !== id));
    } catch (error) {
      console.error("Medya silinemedi", error);
    }
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">P</div>
          <div>
            <strong>Planora</strong>
            <small>Personal Planner</small>
          </div>
        </div>

        <nav className="nav-menu">
          <button
            className={
              activeTab === "dashboard" ? "nav-item active" : "nav-item"
            }
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={activeTab === "tasks" ? "nav-item active" : "nav-item"}
            onClick={() => setActiveTab("tasks")}
          >
            Tasks
          </button>
          <button
            className={activeTab === "notes" ? "nav-item active" : "nav-item"}
            onClick={() => setActiveTab("notes")}
          >
            Notes
          </button>
          <button
            className={activeTab === "media" ? "nav-item active" : "nav-item"}
            onClick={() => setActiveTab("media")}
          >
            Media
          </button>
          <button
            className={activeTab === "profile" ? "nav-item active" : "nav-item"}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
        </nav>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="topbar-label">{pageMeta[activeTab].label}</p>
            <h1>
              <span className="page-icon" aria-hidden="true">
                {pageMeta[activeTab].icon}
              </span>
              {pageMeta[activeTab].title}
            </h1>
          </div>

          <div className="topbar-actions">
            <button
              type="button"
              className="primary-btn"
              onClick={() => setActiveTab("tasks")}
            >
              + New Task
            </button>

            <div className="profile-menu-wrapper">
              <button
                type="button"
                className="profile-badge"
                onClick={() => setProfileMenuOpen((current) => !current)}
              >
                B
              </button>

              {profileMenuOpen && (
                <div className="profile-menu">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("profile");
                      setProfileMenuOpen(false);
                    }}
                  >
                    Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("dashboard");
                      setProfileMenuOpen(false);
                    }}
                  >
                    Settings
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileMenuOpen(false);
                    }}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {activeTab === "dashboard" && (
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
        )}

        {activeTab === "tasks" && (
          <div className="content-section">
            <div className="task-summary-row">
              <div className="task-summary-card">
                <span>Total</span>
                <strong>{todos.length}</strong>
              </div>
              <div className="task-summary-card">
                <span>Done</span>
                <strong>{completedTodos}</strong>
              </div>
              <div className="task-summary-card">
                <span>Pending</span>
                <strong>{pendingTodos}</strong>
              </div>
            </div>
            <ToDoCreate onCreateTodo={createTodo} />
            <ToDoList
              todos={todos}
              onRemoveTodo={removeTodo}
              onUpdateTodo={updateTodo}
            />
          </div>
        )}

        {activeTab === "notes" && (
          <div className="content-section">
            <div className="notes-section">
              <div className="note-create-column">
                <NoteCreate onCreateNote={createNote} />
              </div>

              <div className="note-list-column">
                <NoteList
                  notes={notes}
                  onDeleteNote={deleteNote}
                  onUpdateNote={updateNote}
                  onTogglePin={togglePin}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "media" && (
          <div className="content-section">
            <div className="media-section">
              <MediaCreate onCreateMedia={createMedia} />
              <MediaList mediaList={mediaList} onDeleteMedia={deleteMedia} />
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="content-section">
            <div className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar">B</div>
                <div className="profile-info">
                  <h3>{profile.name}</h3>
                  <p>Productivity-focused planner</p>
                </div>
              </div>

              <div className="profile-grid">
                <label className="profile-box">
                  <span>Name</span>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) =>
                      handleProfileChange("name", e.target.value)
                    }
                  />
                </label>

                <label className="profile-box">
                  <span>Email</span>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      handleProfileChange("email", e.target.value)
                    }
                  />
                </label>

                <label className="profile-box">
                  <span>Focus</span>
                  <input
                    type="text"
                    value={profile.focus}
                    onChange={(e) =>
                      handleProfileChange("focus", e.target.value)
                    }
                  />
                </label>
              </div>

              <div className="profile-actions">
                <button type="button" className="secondary-btn">
                  Cancel
                </button>
                <button type="button" className="primary-btn">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
