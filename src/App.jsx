import { useCallback, useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import AgendarCitaModal from './components/AgendarCitaModal';

export default function App() {
  const [negocio, setNegocio] = useState(null);
  const [servicios, setServicios] = useState([]);
  const [citas, setCitas] = useState([]);
  const [user, setUser] = useState(null);
  const [vista, setVista] = useState('home');
  const [modalCitaOpen, setModalCitaOpen] = useState(false);

  const cargarHomeData = useCallback(async () => {
    try {
      const res = await fetch('/api/home-data');
      const data = await res.json();
      if (data.success) {
        setNegocio(data.negocio);
        setServicios(data.servicios || []);
      }
    } catch (err) {
      console.error('Error al cargar /api/home-data:', err);
    }
  }, []);

  const cargarCitas = useCallback(async () => {
    try {
      const res = await fetch('/api/citas');
      const data = await res.json();
      if (data.success) {
        setCitas(data.citas || []);
      }
    } catch (err) {
      console.error('Error al cargar /api/citas:', err);
    }
  }, []);

  useEffect(() => {
    cargarHomeData();
    cargarCitas();
  }, [cargarHomeData, cargarCitas]);

  return (
    <div className="app-shell">
      <Navbar
        negocio={negocio}
        user={user}
        vista={vista}
        setVista={setVista}
        onLogout={() => {
          setUser(null);
          setVista('home');
        }}
        onOpenCita={() => setModalCitaOpen(true)}
      />

      <main>
        {vista === 'home' && (
          <Home
            negocio={negocio}
            servicios={servicios}
            user={user}
            onOpenCita={() => setModalCitaOpen(true)}
            onRefreshData={cargarHomeData}
          />
        )}

        {vista === 'login' && (
          <Login
            onLoginSuccess={(loggedUser) => {
              setUser(loggedUser);
              setVista('home');
            }}
            onCancel={() => setVista('home')}
          />
        )}

        {vista === 'citas' && (
          <section className="citas-container">
            <div className="citas-header">
              <h2 className="section-title" style={{ margin: 0 }}>
                Citas Registradas
              </h2>
              <button type="button" onClick={() => setModalCitaOpen(true)} className="btn-primary">
                + Nueva Cita
              </button>
            </div>

            {citas.length === 0 ? (
              <div className="card-box muted-text">
                Aún no hay citas agendadas en esta sesión.
              </div>
            ) : (
              <div className="citas-list">
                {citas.map((cita) => (
                  <div key={cita.id} className="cita-item">
                    <div>
                      <strong>Cita #{cita.id}</strong> — <span>{cita.fecha_hora_inicio}</span>
                    </div>
                    <span className="badge-pending">{cita.estado}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      <AgendarCitaModal
        open={modalCitaOpen}
        onClose={() => setModalCitaOpen(false)}
        servicios={servicios}
        user={user}
        onCitaCreada={() => cargarCitas()}
      />
    </div>
  );
}