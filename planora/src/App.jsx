import { useEffect, useState } from "react";
import "./App.css";
import "./css/auth.css";
import ToDoCreate from "./components/ToDoCreate";
import ToDoList from "./components/ToDoList";
import "./css/notes.css";
import NoteCreate from "./components/NoteCreate";
import NoteList from "./components/NoteList";
import DashboardPage from "./components/dashboard/DashboardPage";
import useMedia from "./hooks/useMedia";
import useNotes from "./hooks/useNotes";
import useTasks from "./hooks/useTasks";
import MediaCreate from "./components/MediaCreate";
import MediaList from "./components/MediaList";

import AuthPage from "./components/auth/AuthPage";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "./api/authApi";
import ProfilePage from "./components/ProfilePage";
import "./css/profile.css";
import {
  buildProfileAvatarUrl,
  changePassword,
  updateProfile,
  uploadProfileAvatar,
} from "./api/profileApi";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [toast, setToast] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({
      message,
      type,
    });
  };

  useEffect(() => {
    if (!toast) return;

    const timeoutId = setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [toast]);
  
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
  const {
    todos,
    reminders,
    completedTodos,
    pendingTodos,
    createTodo,
    removeTodo,
    updateTodo,
    clearTaskData,
  } = useTasks(currentUser);

  const {
    notes,
    pinnedNotes,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    clearNoteData,
  } = useNotes(currentUser);

  const {
    mediaList,
    createMedia,
    uploadMedia,
    deleteMedia,
    updateMedia,
    clearMediaData,
  } = useMedia(currentUser, showToast);

  const [avatarVersion, setAvatarVersion] = useState(() => Date.now());

  const profileAvatarUrl = buildProfileAvatarUrl(
    currentUser?.avatarUrl,
    avatarVersion,
  );
  const handleSaveProfile = async (profileData) => {
    const updatedUser = await updateProfile(profileData);

    setCurrentUser(updatedUser);
    showToast("Profil başarıyla güncellendi.");

    return updatedUser;
  };

  const handleChangePassword = async (passwordData) => {
    await changePassword(passwordData);
    showToast("Şifren başarıyla değiştirildi.");
  };

  const handleUploadAvatar = async (file) => {
    const updatedUser = await uploadProfileAvatar(file);

    setCurrentUser(updatedUser);
    setAvatarVersion(Date.now());

    showToast("Profil fotoğrafı başarıyla güncellendi.");

    return updatedUser;
  };

  useEffect(() => {
    let isActive = true;

    const checkSession = async () => {
      try {
        const user = await getCurrentUser();

        if (isActive) {
          setCurrentUser(user);
        }
      } catch (error) {
        if (isActive && error.response?.status !== 401) {
          console.error("Session kontrol edilemedi:", error);
        }
      } finally {
        if (isActive) {
          setIsAuthChecking(false);
        }
      }
    };

    checkSession();

    return () => {
      isActive = false;
    };
  }, []);

  const handleLogin = async (loginData) => {
    const user = await loginUser(loginData);
    setCurrentUser(user);
  };

  const handleRegister = async (registerData) => {
    await registerUser(registerData);

    const user = await loginUser({
      email: registerData.email,
      password: registerData.password,
    });

    setCurrentUser(user);
  };

  const handleLogout = async () => {
    setProfileMenuOpen(false);

    try {
      await logoutUser();

      setCurrentUser(null);
      clearTaskData();
      clearNoteData();
      clearMediaData();
    } catch (error) {
      console.error("Çıkış yapılamadı:", error);
      showToast("Çıkış yapılamadı. Lütfen tekrar deneyin.", "error");
    }
  };

  if (isAuthChecking) {
    return <div className="auth-loading">Planora yükleniyor...</div>;
  }

  if (!currentUser) {
    return <AuthPage onLogin={handleLogin} onRegister={handleRegister} />;
  }

  return (
    <div className="app-shell">
      {toast && (
        <div
          className={`app-toast ${toast.type}`}
          role={toast.type === "error" ? "alert" : "status"}
        >
          <span className="app-toast-icon">
            {toast.type === "error" ? "✕" : "✓"}
          </span>

          <span>{toast.message}</span>

          <button
            type="button"
            className="app-toast-close"
            onClick={() => setToast(null)}
            aria-label="Bildirimi kapat"
          >
            ×
          </button>
        </div>
      )}
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
                {profileAvatarUrl ? (
                  <img
                    src={profileAvatarUrl}
                    alt={`${currentUser.name} profil fotoğrafı`}
                  />
                ) : (
                  currentUser.name?.trim().charAt(0).toUpperCase() || "?"
                )}
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
                
                  <button type="button" onClick={handleLogout}>
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {activeTab === "dashboard" && (
          <DashboardPage
            todos={todos}
            notes={notes}
            mediaList={mediaList}
            reminders={reminders}
            pinnedNotes={pinnedNotes}
          />
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
              <MediaCreate
                onCreateMedia={createMedia}
                onUploadMedia={uploadMedia}
              />
              <MediaList
                mediaList={mediaList}
                onDeleteMedia={deleteMedia}
                onUpdateMedia={updateMedia}
              />
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="content-section">
            <ProfilePage
              user={currentUser}
              avatarUrl={profileAvatarUrl}
              onSaveProfile={handleSaveProfile}
              onUploadAvatar={handleUploadAvatar}
              onChangePassword={handleChangePassword}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
