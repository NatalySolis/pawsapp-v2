import store from './_store.js';

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ success: true, citas: store.citas });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Método no permitido' });
  }

  const {
    usuario_id,
    nombre_cliente,
    telefono,
    correo,
    nombre_mascota,
    especie,
    raza,
    edad,
    servicio_id,
    fecha,
    hora
  } = req.body || {};

  if (!nombre_cliente || !telefono || !nombre_mascota || !fecha || !hora) {
    return res.status(400).json({
      success: false,
      message: 'Debes iniciar sesión y completar los campos obligatorios para agendar.'
    });
  }

  const cliente = {
    id: Date.now(),
    negocio_id: 1,
    nombre_completo: nombre_cliente,
    telefono,
    correo: correo || null
  };
  store.clientes.push(cliente);

  const mascota = {
    id: Date.now() + 1,
    negocio_id: 1,
    cliente_id: cliente.id,
    nombre: nombre_mascota,
    especie: especie || 'Perro',
    raza: raza || null,
    edad: edad ? Number(edad) : null
  };
  store.mascotas.push(mascota);

  const cita = {
    id: Date.now() + 2,
    negocio_id: 1,
    cliente_id: cliente.id,
    mascota_id: mascota.id,
    usuario_id: usuario_id || null,
    servicio_id: servicio_id ? Number(servicio_id) : null,
    fecha_hora_inicio: `${fecha} ${hora}:00`,
    estado: 'PENDIENTE'
  };
  store.citas.push(cita);

  return res.status(201).json({
    success: true,
    id: cita.id,
    cita,
    message: 'Cita agendada con éxito'
  });
}