import { useRef, useState } from "react";
import { FiCamera } from "react-icons/fi";
function ProfilePage({ user, avatarUrl, onSaveProfile, onUploadAvatar }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: user.name,
    focus: user.focus || "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Profil fotoğrafı JPG, PNG veya WebP olmalıdır.");
      event.target.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setError("Profil fotoğrafı en fazla 5 MB olabilir.");
      event.target.value = "";
      return;
    }

    setError("");
    setIsUploadingAvatar(true);

    try {
      await onUploadAvatar(file);
    } catch (requestError) {
      const responseData = requestError.response?.data;

      setError(
        typeof responseData === "string"
          ? responseData
          : responseData?.message || "Profil fotoğrafı yüklenemedi.",
      );
    } finally {
      setIsUploadingAvatar(false);
      event.target.value = "";
    }
  };

  const handleCancel = () => {
    setForm({
      name: user.name,
      focus: user.focus || "",
    });

    setError("");
    setIsEditing(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setIsSaving(true);

    try {
      await onSaveProfile(form);
      setIsEditing(false);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Profil kaydedilemedi. Lütfen tekrar deneyin.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const firstLetter = user.name?.trim().charAt(0).toUpperCase() || "?";

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const avatarInputRef = useRef(null);
  return (
    <section className="profile-page">
      <div className="profile-cover" />

      <div className="profile-main-card">
        <div className="profile-identity">
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar-large">
              {avatarUrl ? (
                <img src={avatarUrl} alt={`${user.name} profil fotoğrafı`} />
              ) : (
                <span>{firstLetter}</span>
              )}
            </div>

            <input
              ref={avatarInputRef}
              className="profile-avatar-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAvatarChange}
            />

            <button
              type="button"
              className="profile-avatar-upload-button"
              onClick={() => avatarInputRef.current?.click()}
              disabled={isUploadingAvatar || isSaving}
              aria-label="Profil fotoğrafını değiştir"
              title="Profil fotoğrafını değiştir"
            >
              {isUploadingAvatar ? "…" : <FiCamera />}
            </button>
          </div>

          <div className="profile-identity-text">
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>

          {!isEditing && (
            <button
              type="button"
              className="profile-edit-button"
              onClick={() => setIsEditing(true)}
            >
              Profili düzenle
            </button>
          )}
        </div>

        <form className="profile-details-form" onSubmit={handleSubmit}>
          <div className="profile-section-heading">
            <div>
              <h3>Kişisel bilgiler</h3>
              <p>Profil bilgilerini buradan yönetebilirsin.</p>
            </div>
          </div>

          <div className="profile-fields-grid">
            <label className="profile-field">
              <span>Ad soyad</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                disabled={!isEditing}
                minLength={2}
                maxLength={100}
                required
              />
            </label>

            <label className="profile-field">
              <span>E-posta</span>
              <input type="email" value={user.email} disabled />
              <small>
                E-posta adresi giriş kimliğin olduğu için buradan
                değiştirilemez.
              </small>
            </label>

            <label className="profile-field">
              <span>Odak alanı</span>
              <input
                type="text"
                name="focus"
                value={form.focus}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Örneğin: Full Stack Development"
                maxLength={100}
                required
              />
            </label>

            <label className="profile-field">
              <span>Hesap türü</span>
              <input type="text" value="Kişisel Planora hesabı" disabled />
            </label>
          </div>

          {error && (
            <p className="profile-error" role="alert">
              {error}
            </p>
          )}

          {isEditing && (
            <div className="profile-form-actions">
              <button
                type="button"
                className="profile-cancel-button"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Vazgeç
              </button>

              <button
                type="submit"
                className="profile-save-button"
                disabled={isSaving}
              >
                {isSaving ? "Kaydediliyor..." : "Değişiklikleri kaydet"}
              </button>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

export default ProfilePage;
