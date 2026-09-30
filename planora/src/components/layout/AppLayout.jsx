import { useState } from "react";

const PAGE_META = {
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

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "tasks", label: "Tasks" },
  { id: "notes", label: "Notes" },
  { id: "media", label: "Media" },
  { id: "profile", label: "Profile" },
];

function AppLayout({
  activeTab,
  onTabChange,
  currentUser,
  profileAvatarUrl,
  toast,
  onCloseToast,
  onLogout,
  children,
}) {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const pageMeta = PAGE_META[activeTab];

  const navigateTo = (tab) => {
    onTabChange(tab);
    setProfileMenuOpen(false);
  };

  const handleLogout = () => {
    setProfileMenuOpen(false);
    onLogout();
  };

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
            onClick={onCloseToast}
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
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={
                activeTab === item.id ? "nav-item active" : "nav-item"
              }
              onClick={() => navigateTo(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="topbar-label">{pageMeta.label}</p>
            <h1>
              <span className="page-icon" aria-hidden="true">
                {pageMeta.icon}
              </span>
              {pageMeta.title}
            </h1>
          </div>

          <div className="topbar-actions">
            <button
              type="button"
              className="primary-btn"
              onClick={() => navigateTo("tasks")}
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
                  <button type="button" onClick={() => navigateTo("profile")}>
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

        {children}
      </main>
    </div>
  );
}

export default AppLayout;
