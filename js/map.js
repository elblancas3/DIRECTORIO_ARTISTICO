/**
 * map.js
 * -----------------------------------------------------------------------
 * Geovisor con mapa base negro (Leaflet + CARTO Dark Matter, sin API key)
 * y pines diferenciados por tipo de sitio y por acceso público/privado.
 * -----------------------------------------------------------------------
 */

const NLMap = (function () {
  let map;
  let markers = []; // { marker, tipo, acceso }
  let activeTipos = null;   // null = todos
  let activeAcceso = null;  // null = todos

  function buildIcon(sitio) {
    const cfg = TIPOS_SITIO[sitio.tipo] || TIPOS_SITIO.espacio_publico;
    const acceso = TIPOS_ACCESO[sitio.acceso] || TIPOS_ACCESO.publico;
    const borderStyle = acceso.dash ? "dashed" : "solid";
    const html = `
      <div class="nl-pin" style="
        width:26px;height:26px;border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        background:${cfg.color};
        border:2px ${borderStyle} #F5F1EA;
        box-shadow:0 3px 10px rgba(0,0,0,0.5);
        display:flex;align-items:center;justify-content:center;">
        <span style="transform:rotate(45deg);font-size:12px;">${cfg.icon}</span>
      </div>`;
    return L.divIcon({
      html,
      className: "nl-pin-wrap",
      iconSize: [26, 26],
      iconAnchor: [13, 26],
      popupAnchor: [0, -26]
    });
  }

  function buildPopup(sitio) {
    const cfg = TIPOS_SITIO[sitio.tipo] || {};
    const acceso = TIPOS_ACCESO[sitio.acceso] || {};

    // la imagen solo se muestra si hay URL; si falla al cargar, se oculta sola
    const imgHtml = sitio.imagen
      ? `<img src="${sitio.imagen}" alt="${sitio.nombre}" onerror="this.style.display='none'">`
      : "";

    // links opcionales: sitio web y redes sociales
    const links = [];
    if (sitio.sitio_web) links.push(`<a href="${sitio.sitio_web}" target="_blank" rel="noopener">🌐 Sitio web</a>`);
    if (sitio.redes_sociales) links.push(`<a href="${sitio.redes_sociales}" target="_blank" rel="noopener">📱 Redes sociales</a>`);
    const linksHtml = links.length
      ? `<p class="meta links">${links.join(" &nbsp;·&nbsp; ")}</p>`
      : "";

    return `
      <div class="pin-popup">
        ${imgHtml}
        <span class="tag">${cfg.label || sitio.tipo} · ${acceso.label || sitio.acceso}</span>
        <h4>${sitio.nombre}</h4>
        <p class="meta">${sitio.municipio} — ${sitio.direccion}</p>
        <p class="desc">${sitio.descripcion}</p>
        ${sitio.telefono ? `<p class="meta">📞 ${sitio.telefono}</p>` : ""}
        ${linksHtml}
      </div>`;
  }

  function init(sitios) {
    map = L.map("map", {
      zoomControl: true,
      minZoom: 9,
      maxZoom: 18
    }).setView([25.685, -100.33], 11);

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: "abcd",
        maxZoom: 19
      }
    ).addTo(map);

    sitios.forEach((sitio) => {
      // se salta filas incompletas (sin lat/lng válidos) en vez de romper el mapa
      const lat = Number(sitio.lat);
      const lng = Number(sitio.lng);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        console.warn("Sitio sin lat/lng válidos, se omite del mapa:", sitio.nombre || sitio.id);
        return;
      }
      const marker = L.marker([lat, lng], { icon: buildIcon(sitio) })
        .bindPopup(buildPopup(sitio));
      marker.addTo(map);
      markers.push({ marker, tipo: sitio.tipo, acceso: sitio.acceso });
    });
  }

  function applyFilters(tiposSet, accesoSet) {
    activeTipos = tiposSet;
    activeAcceso = accesoSet;
    markers.forEach(({ marker, tipo, acceso }) => {
      const tipoOk = !activeTipos || activeTipos.size === 0 || activeTipos.has(tipo);
      const accesoOk = !activeAcceso || activeAcceso.size === 0 || activeAcceso.has(acceso);
      const visible = tipoOk && accesoOk;
      if (visible) {
        if (!map.hasLayer(marker)) marker.addTo(map);
      } else {
        if (map.hasLayer(marker)) map.removeLayer(marker);
      }
    });
  }

  return { init, applyFilters };
})();
