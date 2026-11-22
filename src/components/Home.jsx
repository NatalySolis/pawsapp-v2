import { useState } from 'react';

export default function Home({ negocio, servicios, user, onOpenCita, onRefreshData }) {
  const [mostrarServicios, setMostrarServicios] = useState(true);
  const [editandoNegocio, setEditandoNegocio] = useState(false);
  const [negocioForm, setNegocioForm] = useState({
    nombre: negocio?.nombre || '',
    slogan: negocio?.slogan || '',
    horarios: negocio?.horarios || '',
  });
  const [nuevoServicio, setNuevoServicio] = useState({
    nombre: '',
    categoria: 'Medicina',
    precio: '',
    duracion_estimada: '30',
  });
  const [mensaje, setMensaje] = useState('');

  const esAdmin = user?.rol === 'DUEÑO' || user?.rol === 'ADMIN';

  const guardarNegocio = async (e) => {
    e.preventDefault();
    setMensaje('');
    const res = await fetch('/api/negocio', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(negocioForm),
    });
    const data = await res.json();
    if (data.success) {
      setEditandoNegocio(false);
      setMensaje('Datos del negocio actualizados.');
      onRefreshData();
    }
  };

  const agregarServicio = async (e) => {
    e.preventDefault();
    if (!nuevoServicio.nombre || !nuevoServicio.precio) return;
    setMensaje('');
    const res = await fetch('/api/servicios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoServicio),
    });
    const data = await res.json();
    if (data.success) {
      setNuevoServicio({ nombre: '', categoria: 'Medicina', precio: '', duracion_estimada: '30' });
      setMensaje('Servicio agregado.');
      onRefreshData();
    }
  };

  const eliminarServicio = async (id) => {
    setMensaje('');
    const res = await fetch(`/api/servicios?id=${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      setMensaje('Servicio eliminado.');
      onRefreshData();
    }
  };

  return (
    <div className="home-container">
      <section className="hero-card">
        <span className="hero-badge">
          {negocio?.horarios || 'Lun - Sáb: 8:00 AM - 7:00 PM'}
        </span>
        <h1 className="hero-title">{negocio?.nombre || 'Veterinaria PawsApp'}</h1>
        <p className="hero-slogan">{negocio?.slogan || 'Cuidado y fiabilidad'}</p>

        <div className="hero-actions">
          <button type="button" onClick={onOpenCita} className="btn-primary">
            Agendar Cita Ahora
          </button>
          <button
            type="button"
            onClick={() => setMostrarServicios((prev) => !prev)}
            className="btn-secondary"
          >
            {mostrarServicios ? 'Ocultar Servicios' : 'Ver Servicios & Precios'}
          </button>
          {esAdmin && (
            <button
              type="button"
              onClick={() => {
                setNegocioForm({
                  nombre: negocio?.nombre || '',
                  slogan: negocio?.slogan || '',
                  horarios: negocio?.horarios || '',
                });
                setEditandoNegocio((prev) => !prev);
              }}
              className="btn-dark"
            >
              {editandoNegocio ? 'Cerrar Edición' : 'Editar Negocio'}
            </button>
          )}
        </div>
      </section>

      {mensaje && <div className="alert-success">{mensaje}</div>}

      {esAdmin && editandoNegocio && (
        <form
          onSubmit={guardarNegocio}
          className="card-box form-stack"
          style={{ maxWidth: 540 }}
        >
          <h3 className="modal-title">Editar información del negocio</h3>
          <div className="field-group">
            <label className="field-label">Nombre</label>
            <input
              value={negocioForm.nombre}
              onChange={(e) => setNegocioForm({ ...negocioForm, nombre: e.target.value })}
              className="field-input"
            />
          </div>
          <div className="field-group">
            <label className="field-label">Eslogan</label>
            <input
              value={negocioForm.slogan}
              onChange={(e) => setNegocioForm({ ...negocioForm, slogan: e.target.value })}
              className="field-input"
            />
          </div>
          <div className="field-group">
            <label className="field-label">Horarios</label>
            <input
              value={negocioForm.horarios}
              onChange={(e) => setNegocioForm({ ...negocioForm, horarios: e.target.value })}
              className="field-input"
            />
          </div>
          <div className="form-actions-end">
            <button type="submit" className="btn-primary">
              Guardar cambios
            </button>
          </div>
        </form>
      )}

      {mostrarServicios && (
        <section>
          <h2 className="section-title">Servicios Disponibles</h2>

          <div className="services-grid">
            {servicios.map((srv) => (
              <div key={srv.id} className="service-card">
                <div>
                  <span className="service-tag">{srv.categoria || 'General'}</span>
                  <h3 className="service-name">{srv.nombre}</h3>
                  <p className="service-meta">
                    Duración estimada: {srv.duracion_estimada} min
                  </p>
                </div>

                <div className="service-footer">
                  <span className="service-price">${srv.precio}</span>
                  <div className="service-actions">
                    <button type="button" onClick={onOpenCita} className="link-btn">
                      Agendar
                    </button>
                    {esAdmin && (
                      <button
                        type="button"
                        onClick={() => eliminarServicio(srv.id)}
                        className="link-danger"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {esAdmin && (
            <form onSubmit={agregarServicio} className="card-box add-service-form">
              <div className="field-group">
                <label className="field-label">Nombre</label>
                <input
                  value={nuevoServicio.nombre}
                  onChange={(e) => setNuevoServicio({ ...nuevoServicio, nombre: e.target.value })}
                  placeholder="Ej. Desparasitación"
                  className="field-input"
                />
              </div>
              <div className="field-group">
                <label className="field-label">Categoría</label>
                <input
                  value={nuevoServicio.categoria}
                  onChange={(e) => setNuevoServicio({ ...nuevoServicio, categoria: e.target.value })}
                  placeholder="Prevención"
                  className="field-input"
                />
              </div>
              <div className="field-group">
                <label className="field-label">Precio ($)</label>
                <input
                  type="number"
                  value={nuevoServicio.precio}
                  onChange={(e) => setNuevoServicio({ ...nuevoServicio, precio: e.target.value })}
                  placeholder="15"
                  className="field-input"
                />
              </div>
              <div className="field-group">
                <label className="field-label">Minutos</label>
                <input
                  type="number"
                  value={nuevoServicio.duracion_estimada}
                  onChange={(e) =>
                    setNuevoServicio({ ...nuevoServicio, duracion_estimada: e.target.value })
                  }
                  placeholder="25"
                  className="field-input"
                />
              </div>
              <button type="submit" className="btn-dark">
                + Servicio
              </button>
            </form>
          )}
        </section>
      )}
    </div>
  );
}