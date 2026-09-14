import { useState } from "react";

function RegisterForm({ onRegister, onShowLogin }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (form.password !== form.confirmPassword) {
      setError("Şifre ve şifre tekrarı eşleşmiyor.");
      return;
    }

    setIsSubmitting(true);

    try {
      await onRegister(form);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Hesap oluşturulamadı. Lütfen tekrar deneyin.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="auth-heading">
        <h1>Planora’ya katıl</h1>
        <p>Planlarını tek bir yerde düzenlemeye başla.</p>
      </div>

      <label className="auth-field">
        <span>İsim</span>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Adını yaz"
          autoComplete="name"
          minLength={2}
          maxLength={100}
          required
        />
      </label>

      <label className="auth-field">
        <span>E-posta</span>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="ornek@email.com"
          autoComplete="email"
          maxLength={160}
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
          placeholder="En az 8 karakter"
          autoComplete="new-password"
          minLength={8}
          maxLength={72}
          required
        />
      </label>

      <label className="auth-field">
        <span>Şifre tekrarı</span>
        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Şifreni tekrar yaz"
          autoComplete="new-password"
          minLength={8}
          maxLength={72}
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
        {isSubmitting ? "Hesap oluşturuluyor..." : "Hesap oluştur"}
      </button>

      <p className="auth-switch-text">
        Zaten hesabın var mı?
        <button type="button" onClick={onShowLogin}>
          Giriş yap
        </button>
      </p>
    </form>
  );
}

export default RegisterForm;
