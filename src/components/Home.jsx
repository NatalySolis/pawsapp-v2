import { useEffect, useState } from 'react';

const DEFAULT_DOG_IMAGE =
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=900&q=80';

export default function Home({
  negocio,
  servicios,
  user,
  onOpenCita,
  onUpdateNegocio,
  onUpdateServicios,
}) {
  const [mostrarServicios, setMostrarServicios] = useState(true);
  const [editandoNegocio, setEditandoNegocio] = useState(false);

  const [negocioForm, setNegocioForm] = useState({
    nombre: negocio?.nombre || 'Veterinaria PawsApp',
    slogan: negocio?.slogan || 'Cuidado y fiabilidad',
    descripcion_inferior:
      negocio?.descripcion_inferior ||
      'Consultas, prevención, cirugía y urgencias 24/7 en un espacio diseñado para la serenidad de tu perro y gato.',
    horarios: negocio?.horarios || 'Lun - Sáb: 8:00 AM - 7:00 PM',
    telefono: negocio?.telefono || '(555) 234-PAWS',
    logo_url: negocio?.logo_url || '',
    imagen_principal: negocio?.imagen_principal || '',
  });

  const [nuevoServicio, setNuevoServicio] = useState({
    nombre: '',
    categoria: 'Medicina',
    precio: '',
    duracion_estimada: '30',
  });
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    setNegocioForm({
      nombre: negocio?.nombre || 'Veterinaria PawsApp',
      slogan: negocio?.slogan || 'Cuidado y fiabilidad',
      descripcion_inferior:
        negocio?.descripcion_inferior ||
        'Consultas, prevención, cirugía y urgencias 24/7 en un espacio diseñado para la serenidad de tu perro y gato.',
      horarios: negocio?.horarios || 'Lun - Sáb: 8:00 AM - 7:00 PM',
      telefono: negocio?.telefono || '(555) 234-PAWS',
      logo_url: negocio?.logo_url || '',
      imagen_principal: negocio?.imagen_principal || '',
    });
  }, [negocio]);

  const esAdmin = user?.rol === 'DUEÑO' || user?.rol === 'ADMIN';

  const leerArchivoComoImagen = (file, campo) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setNegocioForm((prev) => ({ ...prev, [campo]: reader.result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const guardarNegocio = async (e) => {
    e.preventDefault();
    setMensaje('');

    const actualizado = {
      ...negocio,
      ...negocioForm,
    };

    onUpdateNegocio(actualizado);
    setEditandoNegocio(false);
    setMensaje('Cambios guardados y reflejados en la página principal.');

    try {
      await fetch('/api/negocio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actualizado),
      });
    } catch {
      // Ya quedó guardado en estado y localStorage
    }
  };

  const agregarServicio = async (e) => {
    e.preventDefault();
    if (!nuevoServicio.nombre || !nuevoServicio.precio) return;
    setMensaje('');

    const itemCreado = {
      id: Date.now(),
      negocio_id: 1,
      nombre: nuevoServicio.nombre.trim(),
      categoria: (nuevoServicio.categoria || 'General').trim(),
      precio: Number(nuevoServicio.precio),
      duracion_estimada: Number(nuevoServicio.duracion_estimada || 30),
    };

    const listaActualizada = [...servicios, itemCreado];
    onUpdateServicios(listaActualizada);
    setNuevoServicio({ nombre: '', categoria: 'Medicina', precio: '', duracion_estimada: '30' });
    setMostrarServicios(true);
    setMensaje('Servicio agregado y visible en la página principal.');

    try {
      await fetch('/api/servicios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoServicio),
      });
    } catch {
      // Ya quedó guardado en estado y localStorage
    }
  };

  const eliminarServicio = async (id) => {
    setMensaje('');
    const listaActualizada = servicios.filter((srv) => srv.id !== id);
    onUpdateServicios(listaActualizada);
    setMensaje('Servicio eliminado.');

    try {
      await fetch(`/api/servicios?id=${id}`, { method: 'DELETE' });
    } catch {
      // Ya quedó guardado en estado y localStorage
    }
  };

  const handleVerServicios = () => {
    setMostrarServicios((prev) => {
      const next = !prev;
      if (next) {
        setTimeout(() => {
          document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      }
      return next;
    });
  };

  const fotoHeroSrc =
    negocio?.imagen_principal &&
    (negocio.imagen_principal.startsWith('http') ||
      negocio.imagen_principal.startsWith('data:image'))
      ? negocio.imagen_principal
      : DEFAULT_DOG_IMAGE;

  return (
    <div className="home-container">
      {/* 1. Hero */}
      <section className="hero-grid">
        <div>
          <h1 className="hero-title">
            {negocio?.slogan || 'Cuidado y fiabilidad'}
          </h1>

          <div className="schedule-pill">
            <span>🕒</span>
            <span>{negocio?.horarios || 'Lun - Sáb: 8:00 AM - 7:00 PM'}</span>
          </div>

          <p id="about" className="hero-description">
            {negocio?.descripcion_inferior ||
              'Consultas, prevención, cirugía y urgencias 24/7 en un espacio diseñado para la serenidad de tu perro y gato.'}
          </p>

          <div className="hero-cta-stack">
            <button type="button" onClick={onOpenCita} className="btn-coral">
              <span>📅</span>
              <span>Agendar Cita Ahora</span>
            </button>

            <button type="button" onClick={handleVerServicios} className="btn-white-outline">
              <span>▷</span>
              <span>
                {mostrarServicios ? 'Ocultar Servicios & Precios' : 'Ver Servicios & Precios'}
              </span>
            </button>

            {esAdmin && (
              <button
                type="button"
                onClick={() => setEditandoNegocio((prev) => !prev)}
                className="btn-dark"
              >
                {editandoNegocio ? 'Cerrar Edición' : 'Editar Negocio'}
              </button>
            )}
          </div>
        </div>

        <div className="hero-photo-wrap">
          <img
            src={fotoHeroSrc}
            alt="Mascota en clínica veterinaria"
            className="hero-photo"
          />
        </div>
      </section>

      {mensaje && <div className="alert-success">{mensaje}</div>}

      {esAdmin && editandoNegocio && (
        <form
          onSubmit={guardarNegocio}
          className="card-box form-stack secondary-section"
          style={{ maxWidth: 640 }}
        >
          <h3 className="modal-title">Editar información e imágenes del negocio</h3>

          <div className="form-row-2">
            <div className="field-group">
              <label className="field-label">Nombre de la clínica</label>
              <input
                value={negocioForm.nombre}
                onChange={(e) => setNegocioForm({ ...negocioForm, nombre: e.target.value })}
                className="field-input"
              />
            </div>

            <div className="field-group">
              <label className="field-label">Título / Eslogan principal</label>
              <input
                value={negocioForm.slogan}
                onChange={(e) => setNegocioForm({ ...negocioForm, slogan: e.target.value })}
                className="field-input"
              />
            </div>
          </div>

          <div className="form-row-2">
            <div className="field-group">
              <label className="field-label">Horarios</label>
              <input
                value={negocioForm.horarios}
                onChange={(e) => setNegocioForm({ ...negocioForm, horarios: e.target.value })}
                className="field-input"
              />
            </div>

            <div className="field-group">
              <label className="field-label">Teléfono</label>
              <input
                value={negocioForm.telefono}
                onChange={(e) => setNegocioForm({ ...negocioForm, telefono: e.target.value })}
                className="field-input"
              />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">Descripción principal</label>
            <input
              value={negocioForm.descripcion_inferior}
              onChange={(e) =>
                setNegocioForm({ ...negocioForm, descripcion_inferior: e.target.value })
              }
              className="field-input"
            />
          </div>

          <div className="form-row-2">
            <div className="field-group">
              <label className="field-label">Logo (subir archivo o URL)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => leerArchivoComoImagen(e.target.files?.[0], 'logo_url')}
                className="field-input"
              />
              <input
                value={negocioForm.logo_url.startsWith('data:image') ? '' : negocioForm.logo_url}
                onChange={(e) => setNegocioForm({ ...negocioForm, logo_url: e.target.value })}
                placeholder="O pega URL del logo..."
                className="field-input"
              />
            </div>

            <div className="field-group">
              <label className="field-label">Imagen del perrito / Hero (archivo o URL)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  leerArchivoComoImagen(e.target.files?.[0], 'imagen_principal')
                }
                className="field-input"
              />
              <input
                value={
                  negocioForm.imagen_principal.startsWith('data:image')
                    ? ''
                    : negocioForm.imagen_principal
                }
                onChange={(e) =>
                  setNegocioForm({ ...negocioForm, imagen_principal: e.target.value })
                }
                placeholder="O pega URL de la imagen..."
                className="field-input"
              />
            </div>
          </div>

          <div className="form-actions-end">
            <button type="submit" className="btn-coral">
              Guardar y reflejar en inicio
            </button>
          </div>
        </form>
      )}

      {/* 2. Servicios & Precios (arriba de las tarjetas de características) */}
      <section id="services" className="secondary-section">
        {mostrarServicios && (
          <>
            <h2 className="section-title">Servicios & Precios</h2>
            <div className="services-grid">
              {servicios.map((srv) => (
                <div key={srv.id} className="service-card">
                  <div>
                    <span className="service-tag">{srv.categoria || 'General'}</span>
                    <h3 className="service-name">{srv.nombre}</h3>
                    <p className="service-meta">Duración estimada: {srv.duracion_estimada} min</p>
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
          </>
        )}

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

      {/* 3. Tarjetas pequeñas de características */}
      <section className="features-strip">
        <div className="feature-card">
          <div className="feature-icon pink">♡</div>
          <h3 className="feature-title">Manejo Fear-Free</h3>
          <p className="feature-sub">Sin estrés ni sujeciones forzadas</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon blue">🏥</div>
          <h3 className="feature-title">Salas Separadas</h3>
          <p className="feature-sub">Exclusivas para perros y gatos</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon green">🧪</div>
          <h3 className="feature-title">Laboratorio 24/7</h3>
          <p className="feature-sub">Diagnóstico clínico inmediato</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon amber">💊</div>
          <h3 className="feature-title">Farmacia Interna</h3>
          <p className="feature-sub">Medicamentos de dosis exacta</p>
        </div>
      </section>
    </div>
  );
}