const serviciosIniciales = [
  { id: 1, nombre: 'Consulta General', categoria: 'Medicina', precio: 25, duracion_estimada: 30 },
  { id: 2, nombre: 'Baño y Estética', categoria: ' Grooming', precio: 20, duracion_estimada: 60 },
  { id: 3, nombre: 'Vacunación', categoria: 'Prevención', precio: 18, duracion_estimada: 20 }
];

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Método no permitido' });
  }

  return res.status(200).json({
    success: true,
    negocio: {
      nombre: 'PawsApp',
      slogan: 'Cuidado amoroso, profesional y sin estrés para tus compañeros de vida.',
      horarios: 'Lun - Sáb: 8:00 AM - 7:00 PM'
    },
    servicios: serviciosIniciales
  });
}