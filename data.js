/**
 * data.js
 * -----------------------------------------------------------------------
 * Capa de datos del Directorio Artístico y Cultural de Nuevo León.
 *
 * ESTADO ACTUAL: datos de EJEMPLO (ficticios), escritos directamente aquí.
 * Tienen EXACTAMENTE las mismas columnas que debe tener la hoja "sitios"
 * del Google Sheet, para que conectar el Sheet real sea solo cuestión de
 * reemplazar el cuerpo de fetchSites() — el resto del sitio (mapa,
 * filtros, popups) no necesita cambiar.
 *
 * Ver README.md → sección "Conectar Google Sheets (Apps Script)".
 * -----------------------------------------------------------------------
 */

// Tipos de sitio disponibles y su estilo visual en el mapa (color + icono).
// Si agregas un tipo nuevo en el Sheet, agrégalo también aquí.
const TIPOS_SITIO = {
  taller: { label: "Taller", color: "#E7222E", icon: "🖌️" },
  galeria: { label: "Galería", color: "#F5F1EA", icon: "🖼️" },
  museo: { label: "Museo", color: "#8F1620", icon: "🏛️" },
  centro_cultural: { label: "Centro cultural", color: "#C21F2B", icon: "🎭" },
  espacio_publico: { label: "Espacio público", color: "#5B5B5B", icon: "📍" }
};

// Acceso: define el borde/estilo del pin (sólido vs. punteado).
const TIPOS_ACCESO = {
  publico: { label: "Público", dash: false },
  privado: { label: "Privado", dash: true }
};

/**
 * Sitios de ejemplo — Área Metropolitana de Monterrey, Nuevo León.
 * Nombres y direcciones son FICTICIOS para efectos de prototipo.
 *
 * Columnas (== encabezados que debe tener la hoja "sitios" del Sheet):
 * id | nombre | tipo | acceso | municipio | direccion | lat | lng
 * | descripcion | telefono | sitio_web | imagen
 */
const SITIOS = [
  {
    id: "s01",
    nombre: "Taller de Grabado Barrio Antiguo",
    tipo: "taller",
    acceso: "publico",
    municipio: "Monterrey",
    direccion: "Calle Padre Mier 814, Barrio Antiguo",
    lat: 25.6699,
    lng: -100.3099,
    descripcion: "Taller comunitario de grabado y litografía con clases abiertas los sábados.",
    telefono: "+52 81 1234 5678",
    sitio_web: "",
    imagen: "https://picsum.photos/seed/taller1/640/420"
  },
  {
    id: "s02",
    nombre: "Galería Vitral Rojo",
    tipo: "galeria",
    acceso: "privado",
    municipio: "San Pedro Garza García",
    direccion: "Av. Vasconcelos 345, Col. del Valle",
    lat: 25.6515,
    lng: -100.3617,
    descripcion: "Galería contemporánea especializada en obra de artistas emergentes del noreste de México.",
    telefono: "+52 81 2345 6789",
    sitio_web: "",
    imagen: "https://picsum.photos/seed/galeria1/640/420"
  },
  {
    id: "s03",
    nombre: "Museo Itinerante NL",
    tipo: "museo",
    acceso: "publico",
    municipio: "Monterrey",
    direccion: "Av. Constitución 400, Centro",
    lat: 25.6725,
    lng: -100.3092,
    descripcion: "Museo con exposiciones temporales sobre historia y arte regional.",
    telefono: "+52 81 3456 7890",
    sitio_web: "",
    imagen: "https://picsum.photos/seed/museo1/640/420"
  },
  {
    id: "s04",
    nombre: "Centro Cultural Cerro de la Silla",
    tipo: "centro_cultural",
    acceso: "publico",
    municipio: "Guadalupe",
    direccion: "Blvd. Díaz Ordaz 1500",
    lat: 25.6774,
    lng: -100.2597,
    descripcion: "Espacio multidisciplinario: danza, música y artes visuales todo el año.",
    telefono: "+52 81 4567 8901",
    sitio_web: "",
    imagen: "https://picsum.photos/seed/centro1/640/420"
  },
  {
    id: "s05",
    nombre: "Galería Negro Mate",
    tipo: "galeria",
    acceso: "privado",
    municipio: "Monterrey",
    direccion: "Calle Morelos 220, Centro",
    lat: 25.6692,
    lng: -100.3145,
    descripcion: "Galería boutique enfocada en fotografía contemporánea y arte objeto.",
    telefono: "+52 81 5678 9012",
    sitio_web: "",
    imagen: "https://picsum.photos/seed/galeria2/640/420"
  },
  {
    id: "s06",
    nombre: "Taller Cerámica Santa Catarina",
    tipo: "taller",
    acceso: "publico",
    municipio: "Santa Catarina",
    direccion: "Calle Hidalgo 88",
    lat: 25.6742,
    lng: -100.4589,
    descripcion: "Taller de cerámica y escultura con venta directa de piezas de alumnos.",
    telefono: "+52 81 6789 0123",
    sitio_web: "",
    imagen: "https://picsum.photos/seed/taller2/640/420"
  },
  {
    id: "s07",
    nombre: "Plaza Mural Apodaca",
    tipo: "espacio_publico",
    acceso: "publico",
    municipio: "Apodaca",
    direccion: "Plaza Principal, Centro de Apodaca",
    lat: 25.7815,
    lng: -100.1889,
    descripcion: "Corredor de murales urbanos al aire libre, renovado cada año con artistas locales.",
    telefono: "",
    sitio_web: "",
    imagen: "https://picsum.photos/seed/mural1/640/420"
  },
  {
    id: "s08",
    nombre: "Galería San Nicolás Arte Contemporáneo",
    tipo: "galeria",
    acceso: "publico",
    municipio: "San Nicolás de los Garza",
    direccion: "Av. Universidad 1200",
    lat: 25.7417,
    lng: -100.3005,
    descripcion: "Galería universitaria con exhibiciones rotativas de estudiantes y egresados.",
    telefono: "+52 81 7890 1234",
    sitio_web: "",
    imagen: "https://picsum.photos/seed/galeria3/640/420"
  },
  {
    id: "s09",
    nombre: "Museo del Vidrio Soplado",
    tipo: "museo",
    acceso: "privado",
    municipio: "Monterrey",
    direccion: "Calle Zaragoza 560, Centro",
    lat: 25.6658,
    lng: -100.3062,
    descripcion: "Colección permanente y talleres demostrativos de vidrio soplado artesanal.",
    telefono: "+52 81 8901 2345",
    sitio_web: "",
    imagen: "https://picsum.photos/seed/museo2/640/420"
  },
  {
    id: "s10",
    nombre: "Taller Textil Huasteca",
    tipo: "taller",
    acceso: "privado",
    municipio: "Monterrey",
    direccion: "Calle Diego de Montemayor 410",
    lat: 25.6634,
    lng: -100.3151,
    descripcion: "Taller de telar de cintura y bordado con enfoque en tradición huasteca.",
    telefono: "+52 81 9012 3456",
    sitio_web: "",
    imagen: "https://picsum.photos/seed/taller3/640/420"
  }
];

/**
 * fetchSites()
 * Punto único de acceso a los datos del geovisor. Hoy regresa el array
 * SITIOS de arriba. Cuando publiques el Apps Script (ver README.md),
 * reemplaza el cuerpo de esta función por algo así:
 *
 * async function fetchSites() {
 *   const URL = "https://script.google.com/macros/s/TU_ID_DE_DESPLIEGUE/exec";
 *   const res = await fetch(URL);
 *   const rows = await res.json();
 *   return rows.map(r => ({ ...r, lat: parseFloat(r.lat), lng: parseFloat(r.lng) }));
 * }
 *
 * El resto del sitio (mapa, filtros, popups) no necesita ningún cambio.
 */
async function fetchSites() {
  return SITIOS;
}
