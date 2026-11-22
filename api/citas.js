export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Método no permitido' });
  }

  const { nombre_cliente, nombre_mascota, servicio_id, fecha, hora } = req.body || {};

  if (!nombre_cliente || !nombre_mascota || !fecha || !hora) {
    return res.status(400).json({ success: false, message: 'Faltan datos obligatorios de la cita' });
  }

  return res.status(201).json({
    success: true,
    id: Date.now(),
    message: 'Cita agendada con éxito',
    cita: { nombre_cliente, nombre_mascota, servicio_id, fecha, hora }
  });
}