import { useState } from 'react';

export default function AgendarCitaModal({ open, onClose, servicios, user, onCitaCreada }) {
  const [form, setForm] = useState({
    nombre_cliente: user?.nombre || user?.name || '',
    telefono: '',
    correo: user?.email || '',
    nombre_mascota: '',
    especie: 'Perro',
    raza: '',
    edad: '',
    servicio_id: servicios?.[0]?.id || '',
    fecha: '',
    hora: '09:00',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/citas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          servicio_id: form.servicio_id || servicios?.[0]?.id || null,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || 'No se pudo agendar la cita.');
      } else {
        setExito(true);
        if (onCitaCreada) onCitaCreada(data.cita);
      }
    } catch {
      setError('Error de conexión con /api/citas.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setExito(false);
    setError('');
    setForm((prev) => ({
      ...prev,
      telefono: '',
      nombre_mascota: '',
      raza: '',
      edad: '',
      fecha: '',
      hora: '09:00',
    }));
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        {exito ? (
          <div className="modal-success">
            <div style={{ fontSize: '2.4rem' }}>✅</div>
            <h3 className="modal-title">¡Cita Agendada con Éxito!</h3>
            <p className="muted-text">
              Registramos la cita para <strong>{form.nombre_mascota}</strong> el{' '}
              <strong>{form.fecha}</strong> a las <strong>{form.hora}</strong>.
            </p>
            <button type="button" onClick={handleResetAndClose} className="btn-primary">
              Cerrar
            </button>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <h3 className="modal-title">Agendar Cita</h3>
              <button type="button" onClick={handleResetAndClose} className="modal-close">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="form-stack">
              <div className="form-row-2">
                <div className="field-group">
                  <label className="field-label">Tu nombre *</label>
                  <input
                    name="nombre_cliente"
                    value={form.nombre_cliente}
                    onChange={handleChange}
                    required
                    className="field-input"
                    placeholder="Ej. Nataly Cortez"
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">Teléfono *</label>
                  <input
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                    required
                    className="field-input"
                    placeholder="7000-0000"
                  />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">Correo electrónico</label>
                <input
                  type="email"
                  name="correo"
                  value={form.correo}
                  onChange={handleChange}
                  className="field-input"
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div className="form-row-2">
                <div className="field-group">
                  <label className="field-label">Nombre de la mascota *</label>
                  <input
                    name="nombre_mascota"
                    value={form.nombre_mascota}
                    onChange={handleChange}
                    required
                    className="field-input"
                    placeholder="Ej. Max"
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">Especie</label>
                  <select
                    name="especie"
                    value={form.especie}
                    onChange={handleChange}
                    className="field-input"
                  >
                    <option value="Perro">Perro</option>
                    <option value="Gato">Gato</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>

              <div className="form-row-2">
                <div className="field-group">
                  <label className="field-label">Raza</label>
                  <input
                    name="raza"
                    value={form.raza}
                    onChange={handleChange}
                    className="field-input"
                    placeholder="Ej. Mestizo"
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">Edad (años)</label>
                  <input
                    type="number"
                    min="0"
                    name="edad"
                    value={form.edad}
                    onChange={handleChange}
                    className="field-input"
                    placeholder="2"
                  />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">Servicio *</label>
                <select
                  name="servicio_id"
                  value={form.servicio_id}
                  onChange={handleChange}
                  required
                  className="field-input"
                >
                  {servicios.map((srv) => (
                    <option key={srv.id} value={srv.id}>
                      {srv.nombre} — ${srv.precio} ({srv.duracion_estimada} min)
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row-2">
                <div className="field-group">
                  <label className="field-label">Fecha *</label>
                  <input
                    type="date"
                    name="fecha"
                    value={form.fecha}
                    onChange={handleChange}
                    required
                    className="field-input"
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">Hora *</label>
                  <input
                    type="time"
                    name="hora"
                    value={form.hora}
                    onChange={handleChange}
                    required
                    className="field-input"
                  />
                </div>
              </div>

              {error && <p className="alert-error">{error}</p>}

              <div className="form-actions-end">
                <button type="button" onClick={handleResetAndClose} className="btn-secondary">
                  Cancelar
                </button>
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? 'Guardando...' : 'Confirmar Cita'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}