import { useState } from 'react';

export default function Login({ aviso, onLoginSuccess, onCancel }) {
  const [modoRegistro, setModoRegistro] = useState(false);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const alternarModo = () => {
    setModoRegistro((prev) => !prev);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          email,
          password,
          modo: modoRegistro ? 'registro' : 'login',
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(
          data.message ||
            (modoRegistro ? 'No se pudo crear la cuenta.' : 'No se pudo iniciar sesión.')
        );
      } else {
        onLoginSuccess(data.user);
      }
    } catch {
      setError('Error de conexión con /api/login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-box login-card">
      <h2 className="section-title" style={{ marginBottom: 4 }}>
        {modoRegistro ? 'Crear Cuenta' : 'Iniciar Sesión'}
      </h2>
      <p className="muted-text" style={{ marginTop: 0, marginBottom: 14 }}>
        {modoRegistro
          ? 'Registra tus datos para agendar citas en PawsApp.'
          : 'Usa admin@pawsapp.com o entra con tu cuenta registrada.'}
      </p>

      {aviso && (
        <div className="alert-error" style={{ marginBottom: 14 }}>
          {aviso}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-stack">
        {modoRegistro && (
          <div className="field-group">
            <label className="field-label">Nombre completo *</label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required={modoRegistro}
              className="field-input"
              placeholder="Ej. María López"
            />
          </div>
        )}

        <div className="field-group">
          <label className="field-label">Correo electrónico *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="field-input"
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div className="field-group">
          <label className="field-label">Contraseña *</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="field-input"
            placeholder="••••••••"
          />
        </div>

        {error && <p className="alert-error">{error}</p>}

        <div className="form-actions-end">
          <button type="button" onClick={onCancel} className="btn-secondary">
            Volver
          </button>
          <button type="submit" disabled={loading} className="btn-coral">
            {loading
              ? 'Procesando...'
              : modoRegistro
                ? 'Crear cuenta'
                : 'Continuar'}
          </button>
        </div>

        <p className="auth-switch-text">
          {modoRegistro ? (
            <>
              ¿Ya tienes usuario?{' '}
              <button type="button" onClick={alternarModo} className="auth-switch-link">
                Iniciar sesión
              </button>
            </>
          ) : (
            <>
              ¿No tienes usuario?{' '}
              <button type="button" onClick={alternarModo} className="auth-switch-link">
                Crear cuenta
              </button>
            </>
          )}
        </p>
      </form>
    </div>
  );
}