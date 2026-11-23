export default function Navbar({ negocio, user, vista, setVista, onLogout, seccionActiva, setSeccionActiva }) {
  const nombreUsuario = user?.name || user?.nombre || 'Naty Cortez';
  const inicial = nombreUsuario.charAt(0).toUpperCase();

  const irA = (seccion) => {
    setVista('home');
    setSeccionActiva(seccion);
    if (seccion === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(seccion);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <button type="button" onClick={() => irA('home')} className="brand-btn">
          <div className="brand-logo-circle">
            {negocio?.logo_url &&
            (negocio.logo_url.startsWith('data:image') ||
              negocio.logo_url.startsWith('http')) ? (
              <img src={negocio.logo_url} alt="Logo" />
            ) : (
              <span>🐾</span>
            )}
          </div>
          <div>
            <div className="brand-title">{negocio?.nombre || 'PawsApp'}</div>
            <div className="brand-subtitle">CLÍNICA VETERINARIA INTEGRAL</div>
          </div>
        </button>

        <nav className="nav-center">
          <button
            type="button"
            onClick={() => irA('home')}
            className={`nav-link-btn ${vista === 'home' && seccionActiva === 'home' ? 'active' : ''}`}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => irA('services')}
            className={`nav-link-btn ${vista === 'home' && seccionActiva === 'services' ? 'active' : ''}`}
          >
            Services
          </button>
          <button
            type="button"
            onClick={() => irA('about')}
            className={`nav-link-btn ${vista === 'home' && seccionActiva === 'about' ? 'active' : ''}`}
          >
            About
          </button>
        </nav>

        <div className="nav-right">
          <span className="nav-phone">📞 {negocio?.telefono || '(555) 234-PAWS'}</span>

          {user ? (
            <div className="user-pill">
              <div className="user-avatar">{inicial}</div>
              <div className="user-pill-info">
                <span className="user-pill-name">{nombreUsuario}</span>
                <button type="button" onClick={onLogout} className="user-pill-logout">
                  Cerrar sesión
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setVista('login')}
              className="btn-login-pill"
            >
              Iniciar sesión
            </button>
          )}
        </div>
      </div>
    </header>
  );
}