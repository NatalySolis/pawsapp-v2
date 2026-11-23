import store from './_store.js';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Método no permitido' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { email, password, nombre, modo } = body;

    const correoLimpio = String(email || '').trim();
    const claveLimpia = String(password || '').trim();
    const nombreLimpio = String(nombre || '').trim();

    if (!correoLimpio || !claveLimpia) {
      return res
        .status(400)
        .json({ success: false, message: 'Correo y contraseña obligatorios' });
    }

    const existente = store.usuarios.find(
      (u) => u.email.toLowerCase() === correoLimpio.toLowerCase()
    );

    if (modo === 'registro') {
      if (!nombreLimpio) {
        return res
          .status(400)
          .json({ success: false, message: 'Ingresa tu nombre para crear la cuenta' });
      }
      if (existente) {
        return res
          .status(409)
          .json({ success: false, message: 'Ese correo ya tiene una cuenta registrada' });
      }

      const nuevoUsuario = {
        id: Date.now(),
        nombre: nombreLimpio,
        name: nombreLimpio,
        email: correoLimpio,
        password: claveLimpia,
        rol: 'CLIENTE',
        avatar: '',
      };
      store.usuarios.push(nuevoUsuario);

      return res.status(201).json({
        success: true,
        user: {
          id: nuevoUsuario.id,
          nombre: nuevoUsuario.nombre,
          name: nuevoUsuario.name,
          email: nuevoUsuario.email,
          rol: nuevoUsuario.rol,
          avatar: nuevoUsuario.avatar,
        },
      });
    }

    if (!existente) {
      return res.status(404).json({
        success: false,
        message: 'No encontramos ese usuario. Haz clic en "Crear cuenta" para registrarte.',
      });
    }

    if (existente.password && existente.password !== claveLimpia) {
      return res.status(401).json({
        success: false,
        message: 'Contraseña incorrecta.',
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: existente.id,
        nombre: existente.nombre,
        name: existente.nombre,
        email: existente.email,
        rol: existente.rol,
        avatar: existente.avatar || '',
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error interno en /api/login',
    });
  }
}