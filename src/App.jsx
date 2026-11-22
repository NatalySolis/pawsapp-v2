// src/App.jsx
import { useEffect, useState } from 'react';

export default function App() {
  const [negocio, setNegocio] = useState(null);
  const [servicios, setServicios] = useState([]);
  const [form, setForm] = useState({
    nombre_cliente: '',
    nombre_mascota: '',
    fecha: '',
    hora: '09:00',
  });
  const [estadoEnvio, setEstadoEnvio] = useState('');

  useEffect(() => {
    fetch('/api/home-data')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setNegocio(data.negocio);
          setServicios(data.servicios);
        }
      })
      .catch(() => setEstadoEnvio('No se pudo cargar /api/home-data'));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEstadoEnvio('Enviando...');
    try {
      const res = await fetch('/api/citas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setEstadoEnvio(data.success ? `✅ ${data.message}` : `❌ ${data.message}`);
    } catch {
      setEstadoEnvio('❌ Error de red al llamar a /api/citas');
    }
  };

  return (
    <main style={{ maxWidth: 720, margin: '40px auto', fontFamily: 'sans-serif', padding: '0 16px' }}>
      <h1>{negocio?.nombre || 'PawsApp'}</h1>
      <p>{negocio?.slogan || 'Cargando...'}</p>

      <h2>Servicios</h2>
      <ul>
        {servicios.map((s) => (
          <li key={s.id}>
            {s.nombre} — ${s.precio} ({s.duracion_estimada} min)
          </li>
        ))}
      </ul>

      <h2>Agendar cita rápida</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 10, maxWidth: 380 }}>
        <input
          placeholder="Tu nombre"
          value={form.nombre_cliente}
          onChange={(e) => setForm({ ...form, nombre_cliente: e.target.value })}
          required
        />
        <input
          placeholder="Nombre de la mascota"
          value={form.nombre_mascota}
          onChange={(e) => setForm({ ...form, nombre_mascota: e.target.value })}
          required
        />
        <input
          type="date"
          value={form.fecha}
          onChange={(e) => setForm({ ...form, fecha: e.target.value })}
          required
        />
        <input
          type="time"
          value={form.hora}
          onChange={(e) => setForm({ ...form, hora: e.target.value })}
          required
        />
        <button type="submit">Confirmar cita</button>
      </form>

      {estadoEnvio && <p style={{ marginTop: 12 }}>{estadoEnvio}</p>}
    </main>
  );
}