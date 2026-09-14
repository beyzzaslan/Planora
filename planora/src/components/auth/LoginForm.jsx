import { useState } from "react";

function LoginForm({ onLogin, onShowRegister }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      await onLogin(form);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Giriş yapılamadı. Lütfen tekrar deneyin.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="auth-heading">
        <h1>Tekrar hoş geldin</h1>
        <p>Planlarına kaldığın yerden devam et.</p>
      </div>

      <label className="auth-field">
        <span>E-posta</span>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="ornek@email.com"
          autoComplete="email"
          required
        />
      </label>

      <label className="auth-field">
        <span>Şifre</span>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Şifreni yaz"
          autoComplete="current-password"
          required
        />
      </label>

      {error && (
        <p className="auth-error" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="auth-submit-button"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Giriş yapılıyor..." : "Giriş yap"}
      </button>

      <p className="auth-switch-text">
        Henüz hesabın yok mu?
        <button type="button" onClick={onShowRegister}>
          Hesap oluştur
        </button>
      </p>
    </form>
  );
}

export default LoginForm;
