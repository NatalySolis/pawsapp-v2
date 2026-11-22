import store from './_store.js';

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ success: true, servicios: store.servicios });
  }

  if (req.method === 'POST') {
    const { nombre, categoria, precio, duracion_estimada } = req.body || {};
    const nuevoServicio = {
      id: Date.now(),
      nombre,
      categoria: categoria || 'General',
      precio: Number(precio || 0),
      duracion_estimada: Number(duracion_estimada || 30)
    };
    store.servicios.push(nuevoServicio);

    return res.status(201).json({
      success: true,
      id: nuevoServicio.id,
      servicio: nuevoServicio,
      message: 'Servicio creado correctamente'
    });
  }

  if (req.method === 'PUT') {
    const id = Number(req.query.id || req.body?.id);
    const index = store.servicios.findIndex((s) => s.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Servicio no encontrado' });
    }

    const { nombre, categoria, precio, duracion_estimada } = req.body || {};
    store.servicios[index] = {
      ...store.servicios[index],
      nombre: nombre ?? store.servicios[index].nombre,
      categoria: categoria ?? store.servicios[index].categoria,
      precio: precio !== undefined ? Number(precio) : store.servicios[index].precio,
      duracion_estimada:
        duracion_estimada !== undefined
          ? Number(duracion_estimada)
          : store.servicios[index].duracion_estimada
    };

    return res.status(200).json({
      success: true,
      servicio: store.servicios[index],
      message: 'Servicio actualizado'
    });
  }

  if (req.method === 'DELETE') {
    const id = Number(req.query.id || req.body?.id);
    store.servicios = store.servicios.filter((s) => s.id !== id);
    return res.status(200).json({ success: true, message: 'Servicio eliminado' });
  }

  return res.status(405).json({ success: false, message: 'Método no permitido' });
}