import { useState } from 'react';

export default function Login({ onLoginSuccess, onCancel }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || 'No se pudo iniciar sesión.');
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
        Iniciar Sesión
      </h2>
      <p className="muted-text" style={{ marginTop: 0, marginBottom: 18 }}>
        Usa <code>admin@pawsapp.com</code> o entra con cualquier correo.
      </p>

      <form onSubmit={handleSubmit} className="form-stack">
        <div className="field-group">
          <label className="field-label">Nombre (opcional si ya existe)</label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="field-input"
            placeholder="Tu nombre"
          />
        </div>

        <div className="field-group">
          <label className="field-label">Correo electrónico *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="field-input"
            placeholder="admin@pawsapp.com"
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
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Entrando...' : 'Continuar'}
          </button>
        </div>
      </form>
    </div>
  );
}