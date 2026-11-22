import store from './_store.js';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Método no permitido' });
  }

  return res.status(200).json({
    success: true,
    negocio: store.negocio,
    servicios: store.servicios
  });
}