# Directorio Artístico y Cultural de Nuevo León — prototipo

Versión simplificada: **portada + geovisor**. Sitio estático (HTML/CSS/JS puro, sin build ni frameworks) con:

- **Portada**: fondo interactivo de puntos que se dispersan con el mouse (canvas, sin librerías externas).
- **Geovisor**: mapa base negro (Leaflet + CARTO Dark Matter) con pines diferenciados por tipo de sitio (taller, galería, museo, centro cultural, espacio público) y por acceso (público/privado), con filtros y popup informativo.

Los datos de los sitios están en **`js/data.js`**, como datos de ejemplo ficticios, listos para conectarse al Google Sheet real vía el Apps Script incluido en `appscript/Code.gs`.

## Estructura

```
index.html
css/style.css
js/data.js        ← datos de ejemplo + función fetchSites()
js/map.js         ← lógica del geovisor (Leaflet)
js/particles.js   ← fondo de puntos interactivo del hero
js/app.js         ← arma filtros y llama al mapa
assets/           ← imágenes (ya no se usan en esta versión, se dejaron por si sirven después)
appscript/Code.gs ← Apps Script para publicar el Sheet como API JSON
```

## Probar localmente

Es un sitio estático: basta con abrir `index.html` en el navegador, o servirlo con:

```bash
python3 -m http.server 8000
# luego abrir http://localhost:8000
```

(Requiere conexión a internet: carga Leaflet y los tiles del mapa desde CDN).

## Campos para el Google Sheet

Crea una hoja llamada **`sitios`** con estos encabezados, en este orden, en la fila 1:

| Columna       | Descripción                                                                 |
|---------------|------------------------------------------------------------------------------|
| `id`          | Identificador único, ej. `s01`, `s02`…                                        |
| `nombre`      | Nombre del sitio                                                             |
| `tipo`        | Uno de: `taller`, `galeria`, `museo`, `centro_cultural`, `espacio_publico`   |
| `acceso`      | `publico` o `privado`                                                        |
| `municipio`   | Municipio de Nuevo León                                                      |
| `direccion`   | Dirección completa                                                           |
| `lat`         | Latitud (número, ej. `25.6699`)                                              |
| `lng`         | Longitud (número, ej. `-100.3099`)                                           |
| `descripcion` | Descripción corta (1–2 líneas)                                               |
| `telefono`    | Teléfono de contacto (puede ir vacío)                                        |
| `sitio_web`   | Link al sitio web o redes (puede ir vacío)                                   |
| `imagen`      | URL de una foto del sitio (puede ir vacía)                                   |

Si agregas un `tipo` nuevo que no esté en la lista, también agrégalo en el objeto `TIPOS_SITIO` de `js/data.js` (necesita color e ícono para el mapa).

## Conectar el Google Sheet con Apps Script

En vez de depender de un proxy externo, el sitio usa un Apps Script propio que convierte tu Sheet en una API JSON.

1. Abre tu Google Sheet (con la hoja `sitios` ya con encabezados y datos).
2. **Extensiones → Apps Script.**
3. Borra el contenido de `Code.gs` que aparece por default y pega el contenido de **`appscript/Code.gs`** (incluido en este proyecto).
4. Guarda.
5. **Implementar → Nueva implementación → tipo "Aplicación web".**
   - Ejecutar como: **Yo** (tu cuenta)
   - Quién tiene acceso: **Cualquier usuario**
6. Autoriza los permisos que pida Google (es tu propio script, sobre tu propio Sheet).
7. Copia la URL que te da, termina en `/exec`.
8. En `js/data.js`, reemplaza el cuerpo de `fetchSites()`:
   ```js
   async function fetchSites() {
     const URL = "https://script.google.com/macros/s/TU_ID_DE_DESPLIEGUE/exec";
     const res = await fetch(URL);
     const rows = await res.json();
     return rows.map(r => ({ ...r, lat: parseFloat(r.lat), lng: parseFloat(r.lng) }));
   }
   ```
   Nada más en el sitio necesita cambiar — el mapa y los filtros ya leen de esta función.

Cada vez que cambies el código del Apps Script, tienes que ir a **Implementar → Administrar implementaciones → editar (lápiz) → Nueva versión** para que se reflejen los cambios en la URL ya publicada. Si solo cambias datos en el Sheet (agregar/editar filas), no necesitas volver a implementar nada — el endpoint siempre lee la hoja en vivo.

## Migrar a Supabase (más adelante)

Si más adelante decides mover los datos a Supabase, crea una tabla `sitios` con las mismas columnas de la tabla de arriba y sustituye el `fetch` de `fetchSites()` por una consulta `supabase.from('sitios').select('*')`. El resto del sitio no cambia.

## Personalización

- **Colores**: variables `--rojo`, `--rojo-fuerte`, `--negro`, `--blanco` al inicio de `css/style.css`.
- **Fondo 