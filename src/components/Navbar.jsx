export default function Navbar({ negocio, user, vista, setVista, onLogout, onOpenCita }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <button type="button" onClick={() => setVista('home')} className="brand-btn">
          <span>🐾</span>
          <span>{negocio?.nombre || 'Veterinaria PawsApp'}</span>
        </button>

        <nav className="nav-links">
          <button
            type="button"
            onClick={() => setVista('home')}
            className={`nav-btn ${vista === 'home' ? 'active' : ''}`}
          >
            Inicio
          </button>

          <button
            type="button"
            onClick={() => setVista('citas')}
            className={`nav-btn ${vista === 'citas' ? 'active' : ''}`}
          >
            Citas
          </button>

          <button type="button" onClick={onOpenCita} className="btn-primary">
            Agendar Cita
          </button>

          {user ? (
            <div className="user-box">
              <span className="user-name">{user.name || user.nombre}</span>
              <button type="button" onClick={onLogout} className="nav-outline-btn">
                Salir
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setVista('login')}
              className={`nav-outline-btn ${vista === 'login' ? 'active' : ''}`}
            >
              Ingresar
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}