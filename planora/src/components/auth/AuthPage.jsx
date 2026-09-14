import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

function AuthPage({ onLogin, onRegister }) {
  const [activeForm, setActiveForm] = useState("login");

  const showLogin = () => {
    setActiveForm("login");
  };

  const showRegister = () => {
    setActiveForm("register");
  };

  return (
    <main className="auth-page">
      <section className="auth-brand-panel">
        <div className="auth-brand">
          <span className="auth-brand-mark">P</span>
          <span>Planora</span>
        </div>

        <div className="auth-introduction">
          <p className="auth-eyebrow">Kişisel planlama alanın</p>

          <h2>
            Gününü düzenle,
            <br />
            hedeflerine odaklan.
          </h2>

          <p>Görevlerini, notlarını ve kaynaklarını tek bir yerde yönet.</p>
        </div>
      </section>

      <section className="auth-form-panel">
        <div className="auth-form-container">
          {activeForm === "login" ? (
            <LoginForm onLogin={onLogin} onShowRegister={showRegister} />
          ) : (
            <RegisterForm onRegister={onRegister} onShowLogin={showLogin} />
          )}
        </div>
      </section>
    </main>
  );
}

export default AuthPage;
