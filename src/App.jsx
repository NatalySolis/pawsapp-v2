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
  const [seccionActiva, setSeccionActiva] = useState('home');
  const [modalCitaOpen, setModalCitaOpen] = useState(false);
  const [pendienteAbrirCita, setPendienteAbrirCita] = useState(false);
  const [avisoAuth, setAvisoAuth] = useState('');

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

  const solicitarAgendarCita = () => {
    if (!user) {
      setPendienteAbrirCita(true);
      setAvisoAuth('Debes iniciar sesión para poder agendar una cita.');
      setVista('login');
      return;
    }
    setAvisoAuth('');
    setModalCitaOpen(true);
  };

  return (
    <div className="app-shell">
      <Navbar
        negocio={negocio}
        user={user}
        vista={vista}
        setVista={(nuevaVista) => {
          if (nuevaVista === 'login') setAvisoAuth('');
          setVista(nuevaVista);
        }}
        seccionActiva={seccionActiva}
        setSeccionActiva={setSeccionActiva}
        onLogout={() => {
          setUser(null);
          setModalCitaOpen(false);
          setPendienteAbrirCita(false);
          setVista('home');
        }}
      />

      <main>
        {vista === 'home' && (
          <Home
            negocio={negocio}
            servicios={servicios}
            user={user}
            onOpenCita={solicitarAgendarCita}
            onRefreshData={cargarHomeData}
          />
        )}

        {vista === 'login' && (
          <Login
            aviso={avisoAuth}
            onLoginSuccess={(loggedUser) => {
              setUser(loggedUser);
              setAvisoAuth('');
              setVista('home');
              if (pendienteAbrirCita) {
                setPendienteAbrirCita(false);
                setModalCitaOpen(true);
              }
            }}
            onCancel={() => {
              setPendienteAbrirCita(false);
              setAvisoAuth('');
              setVista('home');
            }}
          />
        )}

        {vista === 'citas' && (
          <section className="citas-container">
            <div className="citas-header">
              <h2 className="section-title" style={{ margin: 0 }}>
                Citas Registradas
              </h2>
              <button type="button" onClick={solicitarAgendarCita} className="btn-coral">
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
        open={modalCitaOpen && Boolean(user)}
        onClose={() => setModalCitaOpen(false)}
        servicios={servicios}
        user={user}
        onCitaCreada={() => cargarCitas()}
      />
    </div>
  );
}