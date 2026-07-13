/**
 * app.js
 * -----------------------------------------------------------------------
 * Orquesta la página: carga los sitios (data.js) y arma filtros y mapa
 * (map.js). Versión simplificada: solo portada + geovisor.
 * -----------------------------------------------------------------------
 */

document.addEventListener("DOMContentLoaded", async () => {
  initNavToggle();

  const sitios = await fetchSites();

  initFilters(sitios);
  NLMap.init(sitios);
});

/* ---------------- Nav móvil ---------------- */
function initNavToggle() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  toggle.addEventListener("click", () => nav.classList.toggle("open"));
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => nav.classList.remove("open"))
  );
}

/* ---------------- Filtros del geovisor ---------------- */
function initFilters(sitios) {
  const tiposEl = document.getElementById("filterTipos");
  const accesoEl = document.getElementById("filterAcceso");
  const resetBtn = document.getElementById("filterReset");

  const activeTipos = new Set(Object.keys(TIPOS_SITIO));
  const activeAcceso = new Set(Object.keys(TIPOS_ACCESO));

  const tiposWrap = document.createElement("div");
  tiposWrap.className = "chips";
  Object.entries(TIPOS_SITIO).forEach(([key, cfg]) => {
    const chip = document.createElement("span");
    chip.className = "chip active";
    chip.dataset.key = key;
    chip.innerHTML = `<span class="dot" style="background:${cfg.color}"></span>${cfg.icon} ${cfg.label}`;
    chip.addEventListener("click", () => {
      toggleSet(activeTipos, key, chip);
      NLMap.applyFilters(activeTipos, activeAcceso);
    });
    tiposWrap.appendChild(chip);
  });
  tiposEl.appendChild(tiposWrap);

  const accesoWrap = document.createElement("div");
  accesoWrap.className = "chips";
  Object.entries(TIPOS_ACCESO).forEach(([key, cfg]) => {
    const chip = document.createElement("span");
    chip.className = "chip active";
    chip.dataset.key = key;
    chip.innerHTML = `<span class="dot" style="background:${cfg.dash ? "#5B5B5B" : "#E7222E"}"></span>${cfg.label}`;
    chip.addEventListener("click", () => {
      toggleSet(activeAcceso, key, chip);
      NLMap.applyFilters(activeTipos, activeAcceso);
    });
    accesoWrap.appendChild(chip);
  });
  accesoEl.appendChild(accesoWrap);

  resetBtn.addEventListener("click", () => {
    activeTipos.clear();
    activeAcceso.clear();
    Object.keys(TIPOS_SITIO).forEach((k) => activeTipos.add(k));
    Object.keys(TIPOS_ACCESO).forEach((k) => activeAcceso.add(k));
    document.querySelectorAll(".chip").forEach((c) => c.classList.add("active"));
    NLMap.applyFilters(activeTipos, activeAcceso);
  });

  function toggleSet(set, key, chip) {
    if (set.has(key)) {
      set.delete(key);
      chip.classList.remove("active");
    } else {
      set.add(key);
      chip.classList.add("active");
    }
  }
}
