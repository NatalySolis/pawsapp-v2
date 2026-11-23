import store from './_store.js';

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ success: true, negocio: store.negocio });
  }

  if (req.method !== 'PUT') {
    return res.status(405).json({ success: false, message: 'Método no permitido' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};

  store.negocio = {
    ...store.negocio,
    ...(body.nombre !== undefined ? { nombre: body.nombre } : {}),
    ...(body.slogan !== undefined ? { slogan: body.slogan } : {}),
    ...(body.descripcion_inferior !== undefined
      ? { descripcion_inferior: body.descripcion_inferior }
      : {}),
    ...(body.horarios !== undefined ? { horarios: body.horarios } : {}),
    ...(body.telefono !== undefined ? { telefono: body.telefono } : {}),
    ...(body.logo_url !== undefined ? { logo_url: body.logo_url } : {}),
    ...(body.imagen_principal !== undefined ? { imagen_principal: body.imagen_principal } : {}),
  };

  return res.status(200).json({
    success: true,
    negocio: store.negocio,
    message: 'Configuración del negocio actualizada',
  });
}