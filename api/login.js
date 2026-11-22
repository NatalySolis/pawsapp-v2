import store from './_store.js';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Método no permitido' });
  }

  const { email, password, nombre } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Correo y contraseña obligatorios' });
  }

  let usuario = store.usuarios.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!usuario) {
    const nombreFinal = nombre?.trim() || email.split('@')[0];
    usuario = {
      id: Date.now(),
      nombre: nombreFinal,
      name: nombreFinal,
      email,
      rol: 'CLIENTE',
      avatar: ''
    };
    store.usuarios.push(usuario);
  } else {
    usuario = { ...usuario, name: usuario.nombre };
  }

  return res.status(200).json({
    success: true,
    user: usuario
  });
}