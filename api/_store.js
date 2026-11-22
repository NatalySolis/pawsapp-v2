const initialStore = {
  negocio: {
    id: 1,
    nombre: 'Veterinaria PawsApp',
    slug: 'pawsapp-central',
    slogan: 'Cuidado y fiabilidad',
    horarios: 'Lun - Sáb: 8:00 AM - 7:00 PM',
    logo_url: '/logo.png',
    imagen_principal: ''
  },
  servicios: [
    { id: 1, nombre: 'Consulta General', categoria: 'Medicina', precio: 25, duracion_estimada: 30 },
    { id: 2, nombre: 'Baño y Estética', categoria: 'Estética', precio: 20, duracion_estimada: 60 },
    { id: 3, nombre: 'Vacunación Completa', categoria: 'Prevención', precio: 18, duracion_estimada: 20 }
  ],
  usuarios: [
    { id: 1, nombre: 'Admin PawsApp', email: 'admin@pawsapp.com', password: '123', rol: 'DUEÑO', avatar: '' }
  ],
  clientes: [],
  mascotas: [],
  citas: []
};

if (!globalThis.__pawsappStore) {
  globalThis.__pawsappStore = structuredClone(initialStore);
}

export default globalThis.__pawsappStore;