import store from './_store.js';

export default function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ success: false, message: 'Método no permitido' });
  }

  const { nombre, slogan, horarios, logo_url, imagen_principal } = req.body || {};

  store.negocio = {
    ...store.negocio,
    ...(nombre !== undefined ? { nombre } : {}),
    ...(slogan !== undefined ? { slogan } : {}),
    ...(horarios !== undefined ? { horarios } : {}),
    ...(logo_url !== undefined ? { logo_url } : {}),
    ...(imagen_principal !== undefined ? { imagen_principal } : {})
  };

  return res.status(200).json({
    success: true,
    negocio: store.negocio,
    message: 'Negocio actualizado correctamente'
  });
}